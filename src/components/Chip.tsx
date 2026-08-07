import { useState } from 'react';
import { color, typography, radius } from '../tokens';

/** Figma "Chip / Element" primitive. */
export type ChipTone = 'default' | 'accent' | 'low';
export type ChipSize = 24 | 28 | 32;
export type ChipState = 'enabled' | 'hovered' | 'disabled';

export interface ChipProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'style'> {
  tone?: ChipTone;
  size?: ChipSize;
  /** Outlined (border=true) vs filled (border=false). */
  border?: boolean;
  /** Force a visual state. When omitted, hover is tracked internally. */
  state?: ChipState;
  /** Shows a trailing ✕ that fires `onRemove`. */
  removable?: boolean;
  onRemove?: () => void;
  children: React.ReactNode;
}

const SIZE_SPEC: Record<ChipSize, { padX: number; fontSize: string; lineHeight: string; icon: number }> = {
  24: { padX: 8, fontSize: typography.fontSize[12], lineHeight: typography.lineHeight[16], icon: 12 },
  28: { padX: 8, fontSize: typography.fontSize[14], lineHeight: typography.lineHeight[20], icon: 14 },
  32: { padX: 8, fontSize: typography.fontSize[14], lineHeight: typography.lineHeight[20], icon: 16 },
};

interface Face {
  bg: string;
  border: string;
  fg: string;
}

// tone → filled/outlined → state face
type ToneSpec = { filled: Record<ChipState, Face>; outlined: Record<ChipState, Face> };

const DISABLED_FILLED: Face = { bg: color.fillDisabled, border: 'transparent', fg: color.fgDisabled };
const DISABLED_OUTLINED: Face = { bg: 'transparent', border: color.borderDisabled, fg: color.fgDisabled };

const TONES: Record<ChipTone, ToneSpec> = {
  default: {
    filled: {
      enabled: { bg: color.fillLightLower, border: 'transparent', fg: color.fgDefault },
      hovered: { bg: color.fillLightLowerHovered, border: 'transparent', fg: color.fgDefault },
      disabled: DISABLED_FILLED,
    },
    outlined: {
      enabled: { bg: color.fillLightLow, border: color.borderLightLower, fg: color.fgDefault },
      hovered: { bg: color.fillLightHovered, border: color.borderLightLowerHovered, fg: color.fgDefault },
      disabled: DISABLED_OUTLINED,
    },
  },
  accent: {
    filled: {
      enabled: { bg: color.fillAccentLightLow, border: 'transparent', fg: color.fgAccent },
      hovered: { bg: color.fillAccentLightHovered, border: 'transparent', fg: color.fgAccent },
      disabled: DISABLED_FILLED,
    },
    outlined: {
      enabled: { bg: color.fillAccentLightLow, border: color.borderAccentLight, fg: color.fgAccent },
      hovered: { bg: color.fillAccentLightHovered, border: color.borderAccentLight, fg: color.fgAccent },
      disabled: DISABLED_OUTLINED,
    },
  },
  low: {
    filled: {
      enabled: { bg: color.fillLightLower, border: 'transparent', fg: color.fgLower },
      hovered: { bg: color.fillLightLowerHovered, border: 'transparent', fg: color.fgLower },
      disabled: DISABLED_FILLED,
    },
    outlined: {
      enabled: { bg: color.fillLightLow, border: color.borderLightLower, fg: color.fgLower },
      hovered: { bg: color.fillLightHovered, border: color.borderLightLowerHovered, fg: color.fgLower },
      disabled: DISABLED_OUTLINED,
    },
  },
};

export function Chip({
  tone = 'default',
  size = 28,
  border = false,
  state,
  removable = false,
  onRemove,
  children,
  className = '',
  ...rest
}: ChipProps) {
  const [hovering, setHovering] = useState(false);

  const resolved: ChipState = state ?? (hovering ? 'hovered' : 'enabled');
  const disabled = resolved === 'disabled';
  const spec = SIZE_SPEC[size];
  const face = TONES[tone][border ? 'outlined' : 'filled'][resolved];

  return (
    <span
      className={`inline-flex items-center ${className}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        boxSizing: 'border-box',
        height: size,
        gap: 2,
        padding: `0 ${spec.padX}px`,
        borderRadius: radius.sm,
        border: `1px solid ${face.border}`,
        backgroundColor: face.bg,
        color: face.fg,
        fontFamily: typography.fontFamily,
        fontSize: spec.fontSize,
        lineHeight: spec.lineHeight,
        fontWeight: typography.fontWeight.regular,
        whiteSpace: 'nowrap',
      }}
      {...rest}
    >
      <span>{children}</span>
      {removable && (
        <button
          type="button"
          aria-label="Remove"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) onRemove?.();
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: spec.icon,
            height: spec.icon,
            marginLeft: 2,
            padding: 0,
            border: 0,
            background: 'transparent',
            color: 'inherit',
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
          className="outline-none"
        >
          <svg width={spec.icon} height={spec.icon} viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M4 4L12 12M12 4L4 12"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </span>
  );
}
