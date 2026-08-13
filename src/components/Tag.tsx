import { typography } from '../tokens';

/** Figma "Tag" colors. */
export type TagColor = 'gray' | 'blue' | 'green' | 'red' | 'yellow' | 'purple';

export interface TagProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {
  color?: TagColor;
  children: React.ReactNode;
}

// Each color: light fill + colored border + colored text (Figma Tag tokens).
const TAG_COLORS: Record<TagColor, { fg: string; bg: string; border: string }> = {
  gray: { fg: '#666666', bg: '#fafafa', border: '#d9d9d9' }, // fg-low / fill-light-low / border-light-lower
  blue: { fg: '#2b52f0', bg: '#edf3ff', border: '#bacbff' }, // fg-accent / fill-accent-light-low / border-accent-light
  green: { fg: '#3da600', bg: '#f7fff0', border: '#b2e58a' }, // fg-positive / fill-positive-light / border-positive-light
  red: { fg: '#fc3f45', bg: '#fff3f1', border: '#ffc5c0' }, // fg-critical / fill-critical-light / border-critical-light
  yellow: { fg: '#ff6b08', bg: '#fff7eb', border: '#ffcf94' }, // fg-warning / fill-warning-light / border-warning-light
  purple: { fg: '#722ed1', bg: '#f9f0ff', border: '#d3adf7' }, // purple-40 / purple-95 / purple-80
};

export function Tag({ color = 'gray', children, className = '', ...rest }: TagProps) {
  const c = TAG_COLORS[color];
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        height: 22,
        padding: '0 8px',
        borderRadius: 4,
        border: `1px solid ${c.border}`,
        backgroundColor: c.bg,
        color: c.fg,
        fontFamily: typography.fontFamily,
        fontSize: typography.fontSize[12],
        lineHeight: '18px',
        fontWeight: typography.fontWeight.regular,
        whiteSpace: 'nowrap',
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
