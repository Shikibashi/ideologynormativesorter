import { useCallback, useEffect, useRef, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'error' | 'warning' | 'success';
  onDismiss: () => void;
}

const DISMISS_DELAYS: Record<ToastProps['type'], number> = {
  success: 5_000,
  warning: 8_000,
  error: 8_000,
};

export function Toast({ message, type, onDismiss }: ToastProps) {
  useEffect(() => {
    const id = setTimeout(onDismiss, DISMISS_DELAYS[type]);
    return () => clearTimeout(id);
  }, [type, onDismiss]);

  return (
    <div
      className={`toast toast-${type}`}
      role="status"
      aria-live="polite"
    >
      <span>{message}</span>
      <button
        className="toast-dismiss"
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  );
}

interface ToastState {
  message: string;
  type: 'error' | 'warning' | 'success';
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissToast = useCallback(() => {
    setToast(null);
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const showToast = useCallback(
    (message: string, type: 'error' | 'warning' | 'success') => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
      setToast({ message, type });
      timerRef.current = setTimeout(() => {
        setToast(null);
        timerRef.current = null;
      }, DISMISS_DELAYS[type]);
    },
    [],
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { toast, showToast, dismissToast };
}
