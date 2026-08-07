import { useState } from 'react';
import { color, typography } from '../tokens';

export type CheckboxState = 'enabled' | 'hovered' | 'disabled';

export interface CheckboxProps {
  className?: string;
  labelText?: string;
  showLabel?: boolean;
  /** Checked. Ignored visually when `indeterminate` is set. */
  selected?: boolean;
  /** Renders the mixed (minus/square) mark on a light box. */
  indeterminate?: boolean;
  /** Force a visual state. When omitted, hover is tracked internally. */
  state?: CheckboxState;
  onChange?: (selected: boolean) => void;
  id?: string;
  name?: string;
}

const BOX = 20;

interface Face {
  bg: string;
  border: string;
}

export function Checkbox({
  className = '',
  labelText = 'Checkbox',
  showLabel = true,
  selected = false,
  indeterminate = false,
  state,
  onChange,
  id,
  name,
}: CheckboxProps) {
  const [hovering, setHovering] = useState(false);

  const resolved: CheckboxState = state ?? (hovering ? 'hovered' : 'enabled');
  const disabled = resolved === 'disabled';
  const hovered = resolved === 'hovered';
  // Indeterminate uses the unselected box (light fill) with a filled accent square.
  const filled = selected && !indeterminate;

  const face: Face = filled
    ? disabled
      ? { bg: color.fillAccentDisabled, border: 'transparent' }
      : hovered
        ? { bg: color.fillAccentHovered, border: color.fillAccentHovered }
        : { bg: color.fillAccent, border: color.fillAccent }
    : disabled
      ? { bg: color.fillDisabled, border: color.borderDisabled }
      : hovered
        ? { bg: color.fillLight, border: color.borderAccentHovered }
        : { bg: color.fillLight, border: color.borderLightLower };

  const squareColor = disabled ? color.fillAccentDisabled : color.fillAccent;

  return (
    <div
      className={`inline-flex items-center ${className}`}
      style={{ gap: 8 }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <button
        id={id}
        name={name}
        type="button"
        role="checkbox"
        aria-checked={indeterminate ? 'mixed' : selected}
        aria-label={showLabel ? undefined : labelText}
        disabled={disabled}
        onClick={() => !disabled && onChange?.(!selected)}
        style={{
          boxSizing: 'border-box',
          width: BOX,
          height: BOX,
          minWidth: BOX,
          borderRadius: 2,
          border: `1.5px solid ${face.border}`,
          backgroundColor: face.bg,
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'background-color 120ms ease, border-color 120ms ease',
        }}
        className="flex items-center justify-center p-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        {filled && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path
              d="M2.5 6.2L4.9 8.6L9.5 3.6"
              stroke={color.fgOnAccent}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {indeterminate && (
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 1,
              backgroundColor: squareColor,
            }}
          />
        )}
      </button>

      {showLabel && (
        <label
          htmlFor={id}
          onClick={() => !disabled && onChange?.(!selected)}
          style={{
            fontFamily: typography.fontFamily,
            fontSize: typography.fontSize[14],
            lineHeight: typography.lineHeight[20],
            fontWeight: typography.fontWeight.regular,
            color: disabled ? color.fgDisabled : color.fgDefault,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
          className="select-none"
        >
          {labelText}
        </label>
      )}
    </div>
  );
}
