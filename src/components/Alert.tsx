import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { color, typography, radius, shadow } from '../tokens';
import { Button } from './Button';

export interface AlertProps {
  open: boolean;
  title: React.ReactNode;
  /** Optional supporting text below the title. */
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  /** Show the secondary (cancel) button — Figma `button` True/False. */
  showCancel?: boolean;
  onConfirm: () => void;
  /** Fired by the cancel button, Esc, and backdrop click. Falls back to onConfirm's dismiss if omitted. */
  onCancel?: () => void;
  ariaLabel?: string;
}

export function Alert({
  open,
  title,
  description,
  confirmText = '확인',
  cancelText = '취소',
  showCancel = true,
  onConfirm,
  onCancel,
  ariaLabel,
}: AlertProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const dismiss = onCancel ?? onConfirm;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    cardRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, dismiss]);

  if (!open) return null;

  const titleIsString = typeof title === 'string';

  return createPortal(
    <div
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) dismiss();
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
        role="alertdialog"
        aria-modal="true"
        aria-label={!titleIsString ? ariaLabel : undefined}
        aria-labelledby={titleIsString ? 'mcds-alert-title' : undefined}
        tabIndex={-1}
        style={{
          width: 420,
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          padding: 24,
          backgroundColor: color.fillLight,
          borderRadius: radius.lg,
          boxShadow: shadow.overlay,
          outline: 'none',
          fontFamily: typography.fontFamily,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span
            id={titleIsString ? 'mcds-alert-title' : undefined}
            style={{
              fontSize: typography.fontSize[20],
              lineHeight: typography.lineHeight[28],
              fontWeight: typography.fontWeight.semibold,
              color: color.fgDefault,
            }}
          >
            {title}
          </span>
          {description && (
            <span
              style={{
                fontSize: typography.fontSize[14],
                lineHeight: typography.lineHeight[20],
                fontWeight: typography.fontWeight.regular,
                color: color.fgLow,
              }}
            >
              {description}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
          {showCancel && (
            <Button variant="secondary" size={36} onClick={() => dismiss()}>
              {cancelText}
            </Button>
          )}
          <Button variant="primary" size={36} onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
