import { useState } from 'react';
import { color, typography, radius } from '../tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'md' | 'sm';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const HEIGHT: Record<ButtonSize, number> = { md: 40, sm: 32 };

export function Button({
  variant = 'secondary',
  size = 'md',
  children,
  disabled,
  className = '',
  ...rest
}: ButtonProps) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);

  const accent = disabled
    ? color.fillAccentDisabled
    : press
      ? color.fillAccentPressed
      : hover
        ? color.fillAccentHovered
        : color.fillAccent;

  const styles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      backgroundColor: accent,
      color: color.fgOnAccent,
      border: '1px solid transparent',
    },
    secondary: {
      backgroundColor: disabled
        ? color.fillDisabled
        : hover
          ? color.fillSubtle
          : color.fillLight,
      color: disabled ? color.fgDisabled : color.fgDefault,
      border: `1px solid ${disabled ? color.borderDisabled : color.borderDefault}`,
    },
    ghost: {
      backgroundColor: hover && !disabled ? color.fillSubtle : 'transparent',
      color: disabled ? color.fgDisabled : color.fgDefault,
      border: '1px solid transparent',
    },
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setPress(false);
      }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      className={`outline-none ${className}`}
      style={{
        height: HEIGHT[size],
        padding: size === 'md' ? '0 16px' : '0 12px',
        borderRadius: radius.sm,
        fontFamily: typography.fontFamily,
        fontSize: typography.fontSize[14],
        lineHeight: typography.lineHeight[20],
        fontWeight: typography.fontWeight.medium,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background-color 150ms ease, border-color 150ms ease',
        ...styles[variant],
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
