import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { PHOTO_SLOTS } from "@/data/property";

export function Gallery({
  photos,
  extraPhotos = [],
}: {
  photos: Record<string, string>;
  extraPhotos?: { id: string; src: string; room: string; caption: string }[];
}) {
  const base = PHOTO_SLOTS.flatMap((slot) => {
    const src = photos[slot.id] || slot.src;
    return src ? [{ ...slot, src }] : [];
  });
  const extras = extraPhotos.map((p) => ({
    id: p.id,
    src: p.src,
    alt: p.caption,
    caption: p.caption,
    room: p.room,
  }));
  const slots = [...extras, ...base];
  const [open, setOpen] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open === null) {
      if (dialog.open) dialog.close();
      return;
    }
    if (!dialog.open) dialog.showModal();
  }, [open]);

  useEffect(() => {
    if (open === null) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") {
        setOpen((i) => (i === null ? i : (i + 1) % slots.length));
      }
      if (event.key === "ArrowLeft") {
        setOpen((i) => (i === null ? i : (i - 1 + slots.length) % slots.length));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, slots.length]);

  const current = open === null ? null : slots[open];
  const rooms = [...new Set(slots.map((s) => s.room || "Autres"))];

  if (slots.length === 0) return null;

  return (
    <section aria-label="Photos" className="mx-auto max-w-6xl px-5 pb-4">
      {rooms.map((room) => {
        const items = slots.filter((s) => s.room === room);
        if (items.length === 0) return null;
        return (
          <div key={room} className="mt-10">
            <h2 className="font-display text-2xl text-ink">{room}</h2>
            <ul className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
              {items.map((slot) => {
                const index = slots.findIndex((s) => s.id === slot.id);
                return (
                  <li key={slot.id}>
                    <button type="button" className="group relative block w-full overflow-hidden" onClick={() => setOpen(index)}>
                      <img src={slot.src} alt={slot.alt} className="photo-zoom aspect-photo w-full object-cover" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      <dialog
        ref={dialogRef}
        className="lightbox"
        onClose={() => setOpen(null)}
        onClick={(event) => {
          if (event.target === dialogRef.current) setOpen(null);
        }}
      >
        {current ? (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-sm text-paper">
                {current.caption}
                <span className="ml-3 text-paper/70 tabular-nums">
                  {(open ?? 0) + 1} / {slots.length}
                </span>
              </p>
              <button type="button" className="btn-ghost border-paper/30 text-paper" onClick={() => setOpen(null)}>
                <X className="size-4" />
                Fermer
              </button>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6">
              <button
                type="button"
                aria-label="Photo précédente"
                className="btn-ghost absolute left-3 border-paper/30 text-paper md:left-6"
                onClick={() => setOpen((i) => (i === null ? i : (i - 1 + slots.length) % slots.length))}
              >
                <ChevronLeft className="size-5" />
              </button>
              <img src={current.src} alt={current.alt} className="max-h-full max-w-full object-contain" />
              <button
                type="button"
                aria-label="Photo suivante"
                className="btn-ghost absolute right-3 border-paper/30 text-paper md:right-6"
                onClick={() => setOpen((i) => (i === null ? i : (i + 1) % slots.length))}
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}
