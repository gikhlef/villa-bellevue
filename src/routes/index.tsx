import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/stay/home";

export const Route = createFileRoute("/")({
  component: HomePage,
});
