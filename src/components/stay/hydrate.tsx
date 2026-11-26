import { useEffect } from "react";
import { useStay } from "@/lib/stay-store";

export function HydrateStay() {
  useEffect(() => {
    void useStay.persist.rehydrate();
  }, []);
  return null;
}
