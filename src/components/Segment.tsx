import { color, typography, radius } from '../tokens';

export interface SegmentItem {
  value: string;
  label: string;
}

export interface SegmentProps {
  items: SegmentItem[];
  value: string;
  onChange?: (value: string) => void;
  className?: string;
  ariaLabel?: string;
}

export function Segment({
  items,
  value,
  onChange,
  className = '',
  ariaLabel = 'Segmented control',
}: SegmentProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`inline-flex ${className}`}
      style={{
        padding: 2,
        gap: 2,
        borderRadius: radius.sm,
        backgroundColor: color.fillSubtle,
        border: `1px solid ${color.borderDefault}`,
      }}
    >
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange?.(item.value)}
            style={{
              height: 32,
              padding: '0 14px',
              border: 'none',
              borderRadius: 3,
              backgroundColor: active ? color.fillLight : 'transparent',
              boxShadow: active ? '0px 1px 2px 0px rgba(0,0,0,0.08)' : undefined,
              fontFamily: typography.fontFamily,
              fontSize: typography.fontSize[14],
              lineHeight: typography.lineHeight[20],
              fontWeight: active
                ? typography.fontWeight.semibold
                : typography.fontWeight.regular,
              color: active ? color.fillAccent : color.fgSubtle,
              cursor: 'pointer',
              transition: 'background-color 150ms ease, color 150ms ease',
              whiteSpace: 'nowrap',
            }}
            className="outline-none"
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
