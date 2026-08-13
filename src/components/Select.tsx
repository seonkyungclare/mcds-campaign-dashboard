import { useEffect, useRef, useState } from 'react';
import { color, typography, radius, shadow } from '../tokens';

export interface SelectOption {
  value: string;
  label: string;
}

/** Figma Select sizes. */
export type SelectSize = 32 | 36 | 40;

export interface SelectProps {
  className?: string;
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  /** Error (critical) state. */
  error?: boolean;
  size?: SelectSize;
  placeholder?: string;
  id?: string;
}

const SIZE_SPEC: Record<SelectSize, { fontSize: string; lineHeight: string }> = {
  32: { fontSize: typography.fontSize[14], lineHeight: typography.lineHeight[20] },
  36: { fontSize: typography.fontSize[14], lineHeight: typography.lineHeight[20] },
  40: { fontSize: typography.fontSize[16], lineHeight: typography.lineHeight[24] },
};

export function Select({
  className = '',
  label,
  options,
  value = '',
  onChange,
  disabled = false,
  error = false,
  size = 40,
  placeholder = '선택',
  id,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const selectedOption = options.find((o) => o.value === value);
  const spec = SIZE_SPEC[size];

  // Border by state: focus/open > error > hover > enabled (disabled handled separately).
  const borderColor = disabled
    ? color.borderDisabled
    : open
      ? color.borderAccent
      : error
        ? color.borderCritical
        : hover
          ? color.borderAccentLight
          : color.borderDefault;

  return (
    <div ref={rootRef} className={`relative flex flex-col ${className}`} style={{ gap: 4 }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontFamily: typography.fontFamily,
            fontSize: typography.fontSize[14],
            lineHeight: typography.lineHeight[20],
            fontWeight: typography.fontWeight.medium,
            color: disabled ? color.fgDisabled : color.fgDefault,
          }}
        >
          {label}
        </label>
      )}

      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={error || undefined}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => !disabled && setOpen((v) => !v)}
        style={{
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          height: size,
          padding: '0 12px',
          borderRadius: radius.sm,
          border: `1px solid ${borderColor}`,
          backgroundColor: disabled ? color.fillDisabled : color.fillLight,
          fontFamily: typography.fontFamily,
          fontSize: spec.fontSize,
          lineHeight: spec.lineHeight,
          color: disabled
            ? color.fgDisabled
            : selectedOption
              ? color.fgDefault
              : color.fgLower,
          cursor: disabled ? 'not-allowed' : 'pointer',
          textAlign: 'left',
          transition: 'border-color 150ms ease',
        }}
        className="outline-none"
      >
        <span className="truncate">{selectedOption?.label ?? placeholder}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          style={{
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 150ms ease',
          }}
        >
          <path
            d="M4 6L8 10L12 6"
            stroke={disabled ? color.fgDisabled : color.fgLower}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && !disabled && (
        <ul
          role="listbox"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 4,
            padding: 4,
            listStyle: 'none',
            borderRadius: radius.md,
            border: `1px solid ${color.borderDisabled}`,
            backgroundColor: color.fillLight,
            boxShadow: shadow.overlay,
            zIndex: 50,
            maxHeight: 260,
            overflowY: 'auto',
          }}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange?.(option.value);
                    setOpen(false);
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = color.fillLightHovered;
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: radius.sm,
                    background: isSelected ? color.fillAccentLightLow : 'transparent',
                    fontFamily: typography.fontFamily,
                    fontSize: typography.fontSize[14],
                    lineHeight: typography.lineHeight[20],
                    fontWeight: isSelected
                      ? typography.fontWeight.medium
                      : typography.fontWeight.regular,
                    color: color.fgDefault,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
