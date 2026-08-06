import { useState } from 'react';
import { color, typography } from '../tokens';

export interface TableColumn<T> {
  key: keyof T & string;
  /** Unique column id. Required when two columns derive from the same data key. */
  id?: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  /** Numeric value used for sorting when the cell renders formatted text. */
  sortValue?: (row: T) => number | string;
  render?: (row: T) => React.ReactNode;
}

export interface TableProps<T extends { id: string }> {
  className?: string;
  columns: TableColumn<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export function Table<T extends { id: string }>({
  className = '',
  columns,
  data,
  onRowClick,
  emptyMessage = '데이터가 없습니다',
}: TableProps<T>) {
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' } | null>(null);

  const colId = (c: TableColumn<T>) => c.id ?? c.key;

  const sorted = (() => {
    if (!sort) return data;
    const col = columns.find((c) => colId(c) === sort.key);
    if (!col) return data;
    const get = (row: T) => (col.sortValue ? col.sortValue(row) : row[col.key]);
    return [...data].sort((a, b) => {
      const av = get(a);
      const bv = get(b);
      const cmp =
        typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv), 'ko');
      return sort.dir === 'asc' ? cmp : -cmp;
    });
  })();

  const toggleSort = (key: string) =>
    setSort((prev) =>
      prev?.key === key
        ? prev.dir === 'asc'
          ? { key, dir: 'desc' }
          : null
        : { key, dir: 'asc' },
    );

  const baseCell: React.CSSProperties = {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize[14],
    lineHeight: typography.lineHeight[20],
    padding: '12px 16px',
  };

  return (
    <div
      className={`overflow-x-auto ${className}`}
      style={{ border: `1px solid ${color.borderDefault}`, borderRadius: 8 }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: color.fillSubtle }}>
            {columns.map((col) => {
              const cid = colId(col);
              const active = sort?.key === cid;
              return (
                <th
                  key={cid}
                  scope="col"
                  style={{
                    ...baseCell,
                    width: col.width,
                    textAlign: col.align ?? 'left',
                    fontWeight: typography.fontWeight.semibold,
                    color: color.fgDefault,
                    borderBottom: `1px solid ${color.borderDefault}`,
                    whiteSpace: 'nowrap',
                  }}
                  aria-sort={
                    active ? (sort!.dir === 'asc' ? 'ascending' : 'descending') : undefined
                  }
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(cid)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        border: 'none',
                        background: 'transparent',
                        font: 'inherit',
                        color: active ? color.fillAccent : 'inherit',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      {col.label}
                      <span style={{ fontSize: 10, opacity: active ? 1 : 0.35 }}>
                        {active ? (sort!.dir === 'asc' ? '▲' : '▼') : '⇅'}
                      </span>
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              style={{
                borderBottom: `1px solid ${color.borderDefault}`,
                cursor: onRowClick ? 'pointer' : 'default',
                backgroundColor: color.fillLight,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = color.fillSubtle;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = color.fillLight;
              }}
            >
              {columns.map((col) => (
                <td
                  key={`${row.id}-${colId(col)}`}
                  style={{
                    ...baseCell,
                    textAlign: col.align ?? 'left',
                    color: color.fgDefault,
                    fontVariantNumeric: col.align === 'right' ? 'tabular-nums' : undefined,
                  }}
                >
                  {col.render ? col.render(row) : String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {sorted.length === 0 && (
        <div
          style={{
            ...baseCell,
            padding: '48px 16px',
            textAlign: 'center',
            color: color.fgDisabled,
            backgroundColor: color.fillLight,
          }}
        >
          {emptyMessage}
        </div>
      )}
    </div>
  );
}
