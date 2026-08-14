import type { PresenceState } from "../../lib/types";
import { cn } from "../../lib/cn";

export function PresenceDot({
  state = "unknown",
  className,
}: {
  state?: PresenceState;
  className?: string;
}) {
  const tone =
    state === "online"
      ? "bg-nature"
      : state === "away"
        ? "bg-secondary"
        : state === "offline"
          ? "bg-muted"
          : "bg-line";
  return (
    <span
      className={cn(
        "inline-block h-2.5 w-2.5 rounded-full ring-2 ring-canvas",
        tone,
        state === "online" && "animate-pulse",
        className,
      )}
      aria-hidden
    />
  );
}
