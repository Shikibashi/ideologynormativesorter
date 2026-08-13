import { useEffect, useState } from "react";
import { statusEventName } from "../status";

export function StatusAnnouncer() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    function handleStatus(event: Event): void {
      const detail = (event as CustomEvent<string>).detail;
      if (typeof detail === "string") setMessage(detail);
    }

    window.addEventListener(statusEventName(), handleStatus);
    return () => window.removeEventListener(statusEventName(), handleStatus);
  }, []);

  return (
    <div className="sr-status-announcer" aria-live="polite" aria-atomic="true">
      {message}
    </div>
  );
}
