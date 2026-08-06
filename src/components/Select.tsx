import { useEffect, useRef, useState } from 'react';
import { color, typography, radius, shadow } from '../tokens';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  className?: string;
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  id?: string;
}

export function Select({
  className = '',
  label,
  options,
  value = '',
  onChange,
  disabled = false,
  placeholder = '선택',
  id,
}: SelectProps) {
  const [open, setOpen] = useState(false);
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
        onClick={() => !disabled && setOpen((v) => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          height: 40,
          padding: '0 12px',
          borderRadius: radius.sm,
          border: `1px solid ${open ? color.fillAccent : disabled ? color.borderDisabled : color.borderDefault}`,
          backgroundColor: disabled ? color.fillDisabled : color.fillLight,
          fontFamily: typography.fontFamily,
          fontSize: typography.fontSize[14],
          lineHeight: typography.lineHeight[20],
          color: disabled
            ? color.fgDisabled
            : selectedOption
              ? color.fgDefault
              : color.fgDisabled,
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
            stroke={disabled ? color.fgDisabled : color.fgSubtle}
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
            borderRadius: radius.sm,
            border: `1px solid ${color.borderDefault}`,
            backgroundColor: color.fillLight,
            boxShadow: shadow.overlay,
            zIndex: 50,
            maxHeight: 240,
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
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: radius.sm,
                    background: isSelected ? `${color.fillAccent}14` : 'transparent',
                    fontFamily: typography.fontFamily,
                    fontSize: typography.fontSize[14],
                    lineHeight: typography.lineHeight[20],
                    fontWeight: isSelected
                      ? typography.fontWeight.medium
                      : typography.fontWeight.regular,
                    color: isSelected ? color.fillAccent : color.fgDefault,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                  className="hover:bg-black/5"
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
