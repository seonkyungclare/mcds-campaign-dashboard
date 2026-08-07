import { useState } from 'react';
import { color, typography, radius } from '../tokens';

/** Figma MCDS Button `type` prop. `variant` is kept as a backward-compatible alias. */
export type ButtonType = 'primary' | 'secondary' | 'tertiary' | 'warning';
/** Legacy alias kept for existing call sites (`ghost` maps to `secondary`). */
export type ButtonVariant = ButtonType | 'ghost';
/** Figma sizes are numeric heights. `sm`/`md` kept as legacy aliases. */
export type ButtonSize = 32 | 36 | 40 | 48 | 'sm' | 'md';
export type ButtonContent = 'basic' | 'iconOnly';

type ResolvedState = 'enabled' | 'hovered' | 'pressed' | 'disabled';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style' | 'type'> {
  /** Figma `type`. Takes precedence over `variant` when both are set. */
  type?: ButtonType;
  /** Backward-compatible alias for `type`. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** `iconOnly` renders a square button; `children` should be a single icon. */
  content?: ButtonContent;
  /** Native button type attribute. */
  htmlType?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
}

// height → size spec (basic). iconOnly is a square of `height`.
const SIZE_SPEC: Record<
  32 | 36 | 40 | 48,
  { padX: number; gap: number; fontSize: string; lineHeight: string; fontWeight: number; icon: number }
> = {
  32: { padX: 12, gap: 4, fontSize: typography.fontSize[14], lineHeight: typography.lineHeight[20], fontWeight: typography.fontWeight.regular, icon: 16 },
  36: { padX: 12, gap: 4, fontSize: typography.fontSize[14], lineHeight: typography.lineHeight[20], fontWeight: typography.fontWeight.regular, icon: 18 },
  40: { padX: 16, gap: 6, fontSize: typography.fontSize[16], lineHeight: typography.lineHeight[24], fontWeight: typography.fontWeight.regular, icon: 20 },
  48: { padX: 20, gap: 6, fontSize: typography.fontSize[16], lineHeight: typography.lineHeight[24], fontWeight: typography.fontWeight.semibold, icon: 24 },
};

interface Face {
  bg: string;
  border: string;
  fg: string;
}

// type → state → visual face. Disabled is uniform across types (gray).
const DISABLED: Face = { bg: color.fillDisabled, border: 'transparent', fg: color.fgDisabled };
const DISABLED_OUTLINE: Face = { bg: 'transparent', border: color.borderDisabled, fg: color.fgDisabled };

const FACES: Record<ButtonType, Record<ResolvedState, Face>> = {
  primary: {
    enabled: { bg: color.fillAccent, border: 'transparent', fg: color.fgOnAccent },
    hovered: { bg: color.fillAccentHovered, border: 'transparent', fg: color.fgOnAccent },
    pressed: { bg: color.fillAccentPressed, border: 'transparent', fg: color.fgOnAccent },
    disabled: DISABLED,
  },
  secondary: {
    enabled: { bg: color.fillLight, border: color.borderLightLower, fg: color.fgDefault },
    hovered: { bg: color.fillLightHovered, border: color.borderLightLowerHovered, fg: color.fgDefault },
    pressed: { bg: color.fillLightPressed, border: color.borderLightLowerPressed, fg: color.fgDefault },
    disabled: { bg: color.fillDisabled, border: color.borderDisabled, fg: color.fgDisabled },
  },
  tertiary: {
    enabled: { bg: 'transparent', border: color.borderAccent, fg: color.fgAccent },
    hovered: { bg: color.fillAccentLightHovered, border: color.borderAccentHovered, fg: color.fgAccentHovered },
    pressed: { bg: color.fillAccentLightPressed, border: color.borderAccentPressed, fg: color.fgAccentPressed },
    disabled: DISABLED_OUTLINE,
  },
  warning: {
    enabled: { bg: 'transparent', border: color.borderCritical, fg: color.fgCritical },
    hovered: { bg: color.fillCriticalLightHovered, border: color.borderCriticalHovered, fg: color.fgCriticalHovered },
    pressed: { bg: color.fillCriticalLightPressed, border: color.borderCriticalPressed, fg: color.fgCriticalPressed },
    disabled: DISABLED_OUTLINE,
  },
};

function normalizeType(type?: ButtonType, variant?: ButtonVariant): ButtonType {
  if (type) return type;
  if (variant === 'ghost') return 'secondary';
  return variant ?? 'secondary';
}

function normalizeSize(size: ButtonSize): 32 | 36 | 40 | 48 {
  if (size === 'sm') return 36;
  if (size === 'md') return 40;
  return size;
}

export function Button({
  type,
  variant,
  size = 40,
  content = 'basic',
  htmlType = 'button',
  children,
  disabled,
  className = '',
  ...rest
}: ButtonProps) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);

  const btnType = normalizeType(type, variant);
  const height = normalizeSize(size);
  const spec = SIZE_SPEC[height];

  const state: ResolvedState = disabled
    ? 'disabled'
    : press
      ? 'pressed'
      : hover
        ? 'hovered'
        : 'enabled';
  const face = FACES[btnType][state];
  const isIconOnly = content === 'iconOnly';

  return (
    <button
      type={htmlType}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setPress(false);
      }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      className={`outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${className}`}
      style={{
        boxSizing: 'border-box',
        height,
        width: isIconOnly ? height : undefined,
        padding: isIconOnly ? 0 : `0 ${spec.padX}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isIconOnly ? 0 : spec.gap,
        borderRadius: radius.sm,
        border: `1px solid ${face.border}`,
        backgroundColor: face.bg,
        color: face.fg,
        fontFamily: typography.fontFamily,
        fontSize: spec.fontSize,
        lineHeight: spec.lineHeight,
        fontWeight: spec.fontWeight,
        whiteSpace: 'nowrap',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background-color 150ms ease, border-color 150ms ease, color 150ms ease',
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
