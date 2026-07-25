import type { ReactNode } from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/cn";
import Button from "./Button";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className={cn(
          "relative z-10 w-full max-w-md rounded-sm border border-charcoal-light bg-charcoal-light p-6 shadow-card animate-fade-in",
          className,
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          {title && (
            <h2 id="modal-title" className="font-display text-xl text-white">
              {title}
            </h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="ml-auto -mr-2 -mt-1 px-2"
            aria-label="Close modal"
          >
            ✕
          </Button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
