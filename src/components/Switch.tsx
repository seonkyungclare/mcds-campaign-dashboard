import { useState } from 'react';
import { color, typography, shadow } from '../tokens';

export type SwitchState = 'enabled' | 'hovered' | 'pressed' | 'disabled';
export type SwitchSize = '24' | '20';

export interface SwitchProps {
  className?: string;
  labelText?: string;
  selected?: boolean;
  showLabel?: boolean;
  size?: SwitchSize;
  /** Force a visual state. When omitted, hover/press is tracked internally. */
  state?: SwitchState;
  onChange?: (selected: boolean) => void;
  id?: string;
}

/** MCDS spec: both sizes travel exactly 16px between OFF and ON. */
const SIZE_SPEC = {
  '24': { width: 40, height: 24, handle: 18, pad: 3 },
  '20': { width: 36, height: 20, handle: 14, pad: 3 },
} as const;

const ON_COLOR: Record<SwitchState, string> = {
  enabled: color.fillAccent,
  hovered: color.fillAccentHovered,
  pressed: color.fillAccentPressed,
  disabled: color.fillAccentDisabled,
};

const OFF_COLOR: Record<SwitchState, string> = {
  enabled: color.fillSwitchContainer,
  hovered: color.fillSwitchContainerHovered,
  pressed: color.fillSwitchContainerPressed,
  disabled: color.fillSwitchContainerDisabled,
};

export function Switch({
  className = '',
  labelText = 'Switch',
  selected = true,
  showLabel = false,
  size = '24',
  state,
  onChange,
  id,
}: SwitchProps) {
  const [hovering, setHovering] = useState(false);
  const [pressing, setPressing] = useState(false);

  const resolved: SwitchState =
    state ?? (pressing ? 'pressed' : hovering ? 'hovered' : 'enabled');
  const disabled = resolved === 'disabled';

  const spec = SIZE_SPEC[size];
  const travel = spec.width - spec.pad * 2 - spec.handle;

  return (
    <div className={`inline-flex items-center ${className}`} style={{ gap: 8 }}>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={selected}
        aria-label={showLabel ? undefined : labelText}
        disabled={disabled}
        onClick={() => !disabled && onChange?.(!selected)}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => {
          setHovering(false);
          setPressing(false);
        }}
        onMouseDown={() => setPressing(true)}
        onMouseUp={() => setPressing(false)}
        style={{
          width: spec.width,
          height: spec.height,
          minWidth: spec.width,
          padding: spec.pad,
          borderRadius: 16,
          border: 'none',
          backgroundColor: selected ? ON_COLOR[resolved] : OFF_COLOR[resolved],
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'background-color 150ms ease',
          position: 'relative',
          display: 'block',
        }}
        className="outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        <span
          style={{
            display: 'block',
            width: spec.handle,
            height: spec.handle,
            borderRadius: 16,
            backgroundColor: disabled ? color.fillDisabled : color.fillLight,
            boxShadow: disabled ? shadow.switchHandleDisabled : shadow.switchHandle,
            transform: `translateX(${selected ? travel : 0}px)`,
            transition: 'transform 180ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </button>

      {showLabel && (
        <label
          htmlFor={id}
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
