import { createFileRoute } from "@tanstack/react-router";
import { HostPage } from "@/components/stay/host";

export const Route = createFileRoute("/hote")({
  component: HostPage,
});
