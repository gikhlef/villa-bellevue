import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  defaultProperty,
  exampleBookings,
  type Booking,
  type Property,
} from "@/data/property";
import { eachNight } from "@/lib/dates";

const memory = new Map<string, string>();

const browserStorage = {
  getItem: (name: string) => {
    try {
      if (typeof localStorage === "undefined") return memory.get(name) ?? null;
      return localStorage.getItem(name);
    } catch {
      return memory.get(name) ?? null;
    }
  },
  setItem: (name: string, value: string) => {
    memory.set(name, value);
    try {
      localStorage.setItem(name, value);
    } catch {
      /* quota — kept in memory for this session */
    }
  },
  removeItem: (name: string) => {
    memory.delete(name);
    try {
      localStorage.removeItem(name);
    } catch {
      /* ignore */
    }
  },
};

type StayState = {
  property: Property;
  blocked: string[];
  bookings: Booking[];
  photos: Record<string, string>;
  extraPhotos: { id: string; src: string; room: string; caption: string }[];
  updateProperty: (patch: Partial<Property>) => void;
  toggleBlock: (day: string) => void;
  addBlocked: (days: string[]) => void;
  clearBlocked: () => void;
  addBooking: (input: Omit<Booking, "id" | "createdAt" | "status" | "example">) => string;
  setBookingStatus: (id: string, status: Booking["status"]) => boolean;
  removeBooking: (id: string) => void;
  setPhoto: (id: string, dataUrl: string | null) => void;
  addExtraPhoto: (photo: { src: string; room: string; caption: string }) => void;
  removeExtraPhoto: (id: string) => void;
  clearExamples: () => void;
  resetAll: () => void;
};

function conflicts(
  bookings: Booking[],
  blocked: string[],
  checkIn: string,
  checkOut: string,
  ignoreId?: string,
) {
  const nights = new Set(eachNight(checkIn, checkOut));
  for (const day of blocked) {
    if (nights.has(day)) return true;
  }
  for (const b of bookings) {
    if (b.id === ignoreId || b.status === "declined") continue;
    for (const night of eachNight(b.checkIn, b.checkOut)) {
      if (nights.has(night)) return true;
    }
  }
  return false;
}

export const useStay = create<StayState>()(
  persist(
    (set, get) => ({
      property: defaultProperty,
      blocked: [],
      bookings: exampleBookings(),
      photos: {},
      extraPhotos: [],
      updateProperty: (patch) => set((s) => ({ property: { ...s.property, ...patch } })),
      toggleBlock: (day) =>
        set((s) => ({
          blocked: s.blocked.includes(day)
            ? s.blocked.filter((d) => d !== day)
            : [...s.blocked, day].sort(),
        })),
      addBlocked: (days) =>
        set((s) => ({ blocked: [...new Set([...s.blocked, ...days])].sort() })),
      clearBlocked: () => set({ blocked: [] }),
      addBooking: (input) => {
        const id = crypto.randomUUID();
        const booking: Booking = {
          ...input,
          id,
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ bookings: [booking, ...s.bookings] }));
        return id;
      },
      setBookingStatus: (id, status) => {
        const current = get().bookings.find((b) => b.id === id);
        if (!current) return false;
        if (status === "confirmed") {
          const clash = conflicts(
            get().bookings,
            get().blocked,
            current.checkIn,
            current.checkOut,
            id,
          );
          if (clash) return false;
        }
        set((s) => ({
          bookings: s.bookings.map((b) => (b.id === id ? { ...b, status } : b)),
        }));
        return true;
      },
      removeBooking: (id) => set((s) => ({ bookings: s.bookings.filter((b) => b.id !== id) })),
      setPhoto: (id, dataUrl) =>
        set((s) => {
          const photos = { ...s.photos };
          if (dataUrl) photos[id] = dataUrl;
          else delete photos[id];
          return { photos };
        }),
      addExtraPhoto: (photo) =>
        set((s) => ({
          extraPhotos: [
            { id: crypto.randomUUID(), ...photo },
            ...s.extraPhotos,
          ],
        })),
      removeExtraPhoto: (id) =>
        set((s) => ({ extraPhotos: s.extraPhotos.filter((p) => p.id !== id) })),
      clearExamples: () => set((s) => ({ bookings: s.bookings.filter((b) => !b.example) })),
      resetAll: () =>
        set({
          property: defaultProperty,
          blocked: [],
          bookings: exampleBookings(),
          photos: {},
          extraPhotos: [],
        }),
    }),
    {
      name: "bellevue-v1",
      storage: createJSONStorage(() => browserStorage),
      skipHydration: true,
    },
  ),
);
