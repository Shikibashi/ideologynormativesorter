const STATUS_EVENT = "ecw:status";

export function announceStatus(message: string): void {
  if (typeof window === "undefined" || !message.trim()) return;
  window.dispatchEvent(new CustomEvent(STATUS_EVENT, { detail: message }));
}

export function statusEventName(): string {
  return STATUS_EVENT;
}
