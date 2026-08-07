import { useState } from 'react';
import { color, typography } from '../tokens';

export type RadioState = 'enabled' | 'hovered' | 'disabled';

export interface RadioProps {
  className?: string;
  labelText?: string;
  selected?: boolean;
  showLabel?: boolean;
  /** Force a visual state. When omitted, hover is tracked internally. */
  state?: RadioState;
  onChange?: (selected: boolean) => void;
  id?: string;
  name?: string;
}

const SIZE = 20;
const DOT = 8;

export function Radio({
  className = '',
  labelText = 'Radio button',
  selected = false,
  showLabel = true,
  state,
  onChange,
  id,
  name,
}: RadioProps) {
  const [hovering, setHovering] = useState(false);

  const resolved: RadioState = state ?? (hovering ? 'hovered' : 'enabled');
  const disabled = resolved === 'disabled';

  // Figma matrix: unselected = white fill + gray border (accent border on hover);
  // selected = accent fill (darker on hover, #bacbff when disabled) with a white dot.
  const ringColor = disabled
    ? selected
      ? color.fillAccentDisabled
      : color.borderDisabled
    : selected
      ? resolved === 'hovered'
        ? color.fillAccentHovered
        : color.fillAccent
      : resolved === 'hovered'
        ? color.borderAccentHovered
        : color.borderLightLower;

  const bgColor = selected
    ? disabled
      ? color.fillAccentDisabled
      : resolved === 'hovered'
        ? color.fillAccentHovered
        : color.fillAccent
    : disabled
      ? color.fillDisabled
      : color.fillLight;

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
        role="radio"
        aria-checked={selected}
        aria-label={showLabel ? undefined : labelText}
        disabled={disabled}
        onClick={() => !disabled && onChange?.(true)}
        style={{
          width: SIZE,
          height: SIZE,
          minWidth: SIZE,
          borderRadius: '50%',
          border: `${selected ? 0 : 1.5}px solid ${ringColor}`,
          backgroundColor: bgColor,
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'background-color 150ms ease, border-color 150ms ease',
        }}
        className="flex items-center justify-center p-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        {selected && (
          <span
            style={{
              width: DOT,
              height: DOT,
              borderRadius: '50%',
              backgroundColor: color.fillLight,
            }}
          />
        )}
      </button>

      {showLabel && (
        <label
          htmlFor={id}
          onClick={() => !disabled && onChange?.(true)}
          style={{
            fontFamily: typography.fontFamily,
            fontSize: typography.fontSize[14],
            lineHeight: '22px',
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
