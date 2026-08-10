import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { color, typography, radius, shadow } from '../tokens';

/** Figma "Popup" widths. */
export type ModalSize = 540 | 660 | 780 | 900 | 1020;

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  size?: ModalSize;
  /** Body content. */
  children: React.ReactNode;
  /** Footer content (usually buttons). Omit for no footer. */
  footer?: React.ReactNode;
  /** Show the header ✕ button. */
  showClose?: boolean;
  /** Close when the dim backdrop is clicked. */
  closeOnBackdrop?: boolean;
  /** Accessible label id fallback when `title` is not a string. */
  ariaLabel?: string;
}

const DIVIDER = color.borderDisabled; // #e6e6e6 (border-light-low)

export function Modal({
  open,
  onClose,
  title,
  size = 540,
  children,
  footer,
  showClose = true,
  closeOnBackdrop = true,
  ariaLabel,
}: ModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    cardRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const titleIsString = typeof title === 'string';

  return createPortal(
    <div
      role="presentation"
      onMouseDown={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        backgroundColor: 'rgba(0,0,0,0.45)',
      }}
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={!titleIsString ? ariaLabel : undefined}
        aria-labelledby={titleIsString ? 'mcds-modal-title' : undefined}
        tabIndex={-1}
        style={{
          width: size,
          maxWidth: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: color.fillLight,
          borderRadius: radius.lg,
          boxShadow: shadow.overlay,
          outline: 'none',
          fontFamily: typography.fontFamily,
        }}
      >
        {(title || showClose) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              padding: 24,
              borderBottom: `1px solid ${DIVIDER}`,
            }}
          >
            <span
              id={titleIsString ? 'mcds-modal-title' : undefined}
              style={{
                fontSize: typography.fontSize[20],
                lineHeight: typography.lineHeight[28],
                fontWeight: typography.fontWeight.semibold,
                color: color.fgDefault,
              }}
            >
              {title}
            </span>
            {showClose && (
              <button
                type="button"
                aria-label="닫기"
                onClick={onClose}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 24,
                  height: 24,
                  border: 0,
                  background: 'transparent',
                  color: color.fgDefault,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                  <path
                    d="M5 5l10 10M15 5L5 15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        <div
          style={{
            padding: 24,
            overflowY: 'auto',
            flex: '1 1 auto',
            fontSize: typography.fontSize[14],
            lineHeight: typography.lineHeight[20],
            color: color.fgDefault,
          }}
        >
          {children}
        </div>

        {footer && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 8,
              padding: 24,
              borderTop: `1px solid ${DIVIDER}`,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
