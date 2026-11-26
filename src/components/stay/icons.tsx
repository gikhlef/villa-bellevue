import type { LucideIcon } from "lucide-react";
import {
  Bath,
  BedDouble,
  Car,
  Clapperboard,
  CookingPot,
  Fan,
  Flame,
  KeyRound,
  Mountain,
  Trees,
  UtensilsCrossed,
  WashingMachine,
  Waves,
  Wifi,
} from "lucide-react";
import type { AmenityIcon } from "@/data/property";

export const AMENITY_ICONS: Record<AmenityIcon, LucideIcon> = {
  waves: Waves,
  trees: Trees,
  pot: CookingPot,
  wash: WashingMachine,
  wifi: Wifi,
  car: Car,
  flame: Flame,
  fan: Fan,
  grill: UtensilsCrossed,
  key: KeyRound,
  bed: BedDouble,
  mountain: Mountain,
  film: Clapperboard,
  bath: Bath,
};
