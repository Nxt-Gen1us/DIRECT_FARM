import { useEffect, useRef } from "react";
import { createRealtimeClient, radioConfigured } from "./client";

/**
 * Emits typing start/stop on the live radio only.
 * Does nothing while the radio is dark — no fake farm typing.
 */
export function useTypingPulse(threadId: string | undefined, draft: string) {
  const timer = useRef<number | null>(null);
  const last = useRef(false);

  useEffect(() => {
    if (!threadId || !radioConfigured()) return;
    const client = createRealtimeClient({});
    client.connect();
    const on = draft.trim().length > 0;
    if (on && !last.current) {
      client.typing(threadId, true);
      last.current = true;
    }
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      if (last.current) {
        client.typing(threadId, false);
        last.current = false;
      }
    }, 1200);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
      if (last.current) client.typing(threadId, false);
      client.disconnect();
    };
  }, [draft, threadId]);
}
