import { color, typography } from '../tokens';

export type BadgeTone = 'accent' | 'success' | 'warning' | 'critical' | 'neutral';

export interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}

const TONE: Record<BadgeTone, { fg: string; bg: string }> = {
  accent: { fg: color.fillAccent, bg: `${color.fillAccent}14` },
  success: { fg: color.fgSuccess, bg: color.fillSuccessSubtle },
  warning: { fg: color.fgWarning, bg: color.fillWarningSubtle },
  critical: { fg: color.fgCritical, bg: color.fillCriticalSubtle },
  neutral: { fg: color.fgSubtle, bg: color.fillSubtle },
};

export function Badge({ children, tone = 'neutral', className = '' }: BadgeProps) {
  const t = TONE[tone];
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: 4,
        backgroundColor: t.bg,
        color: t.fg,
        fontFamily: typography.fontFamily,
        fontSize: typography.fontSize[12],
        lineHeight: typography.lineHeight[16],
        fontWeight: typography.fontWeight.medium,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}
