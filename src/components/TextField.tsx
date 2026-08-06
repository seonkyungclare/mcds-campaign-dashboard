import { useState } from 'react';
import { color, typography, radius } from '../tokens';

export interface TextFieldProps {
  className?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  type?: string;
  id?: string;
  leadingIcon?: React.ReactNode;
}

export function TextField({
  className = '',
  label,
  placeholder = '',
  value = '',
  onChange,
  disabled = false,
  error = false,
  errorMessage,
  type = 'text',
  id,
  leadingIcon,
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? color.fgCritical
    : disabled
      ? color.borderDisabled
      : focused
        ? color.fillAccent
        : color.borderDefault;

  return (
    <div className={`flex flex-col ${className}`} style={{ gap: 4 }}>
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

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          height: 40,
          padding: '0 12px',
          borderRadius: radius.sm,
          border: `1px solid ${borderColor}`,
          backgroundColor: disabled ? color.fillDisabled : color.fillLight,
          boxShadow: focused && !error ? `0 0 0 3px ${color.fillAccent}1f` : undefined,
          transition: 'border-color 150ms ease, box-shadow 150ms ease',
        }}
      >
        {leadingIcon && (
          <span style={{ color: color.fgDisabled, display: 'flex' }}>{leadingIcon}</span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={error || undefined}
          style={{
            flex: 1,
            minWidth: 0,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: typography.fontFamily,
            fontSize: typography.fontSize[14],
            lineHeight: typography.lineHeight[20],
            color: disabled ? color.fgDisabled : color.fgDefault,
            cursor: disabled ? 'not-allowed' : 'text',
          }}
        />
      </div>

      {error && errorMessage && (
        <span
          style={{
            fontFamily: typography.fontFamily,
            fontSize: typography.fontSize[12],
            lineHeight: typography.lineHeight[16],
            color: color.fgCritical,
          }}
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
}
