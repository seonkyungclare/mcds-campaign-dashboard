import { useMemo, useState } from 'react';
import { color, typography } from '../tokens';
import { Checkbox } from './Checkbox';
import { Radio } from './Radio';

/** Figma Table cell types (Table / TableCell / Default). */
export type CellType =
  | 'text'
  | 'numericText'
  | 'tag'
  | 'textButton'
  | 'button'
  | 'switch'
  | 'custom';

/** Per-row visual state (Table / TableCell states). */
export type RowState = 'default' | 'error' | 'disabled';

export interface TableColumn<T> {
  key: keyof T & string;
  /** Unique column id. Required when two columns derive from the same data key. */
  id?: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  /** Header filter icon (funnel). */
  filterable?: boolean;
  /** Header info tooltip text (ⓘ). */
  info?: string;
  /** Cell content type — drives default alignment/color. `numericText` right-aligns with tabular figures; `textButton` renders accent-colored. */
  cellType?: CellType;
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
  /** Adds a leading selection column. */
  selectable?: 'checkbox' | 'radio';
  /** Controlled selection. Omit for uncontrolled (internal) selection. */
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  /** Per-row state (error/disabled). */
  rowState?: (row: T) => RowState;
  /** Rows per page. Omit to render all rows without pagination. */
  pageSize?: number;
  /** Controlled current page (1-based). Omit for internal paging. */
  page?: number;
  onPageChange?: (page: number) => void;
}

const CELL_PAD_INLINE = 12;

const SortIcon = ({ dir }: { dir: 'asc' | 'desc' | null }) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden style={{ flex: '0 0 auto' }}>
    <path d="M6 2.5L3.5 5h5L6 2.5z" fill={dir === 'asc' ? color.fgDefault : '#c2c2c2'} />
    <path d="M6 9.5L3.5 7h5L6 9.5z" fill={dir === 'desc' ? color.fgDefault : '#c2c2c2'} />
  </svg>
);

const FilterIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden style={{ flex: '0 0 auto' }}>
    <path d="M1.5 2.5h9L7 6.5v3L5 10.5v-4L1.5 2.5z" fill="#8c8c8c" />
  </svg>
);

const InfoIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden style={{ flex: '0 0 auto' }}>
    <circle cx="6.5" cy="6.5" r="5" stroke="#8c8c8c" strokeWidth="1" />
    <path d="M6.5 5.6v3.2M6.5 3.9v.05" stroke="#8c8c8c" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const Chevron = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d={dir === 'left' ? 'M10 3.5L5.5 8l4.5 4.5' : 'M6 3.5L10.5 8 6 12.5'}
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Build a page list with ellipses, e.g. [1,2,3,4,5,'…',32]. */
function pageItems(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items: (number | 'ellipsis')[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) items.push('ellipsis');
  for (let p = start; p <= end; p++) items.push(p);
  if (end < total - 1) items.push('ellipsis');
  items.push(total);
  return items;
}

export function Table<T extends { id: string }>({
  className = '',
  columns,
  data,
  onRowClick,
  emptyMessage = '데이터가 없습니다',
  selectable,
  selectedIds,
  onSelectionChange,
  rowState,
  pageSize,
  page,
  onPageChange,
}: TableProps<T>) {
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' } | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [internalSelected, setInternalSelected] = useState<string[]>([]);
  const [internalPage, setInternalPage] = useState(1);

  const colId = (c: TableColumn<T>) => c.id ?? c.key;

  const selected = selectedIds ?? internalSelected;
  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const setSelected = (ids: string[]) => {
    if (selectedIds === undefined) setInternalSelected(ids);
    onSelectionChange?.(ids);
  };

  const sorted = useMemo(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, columns, sort]);

  const totalPages = pageSize ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  const curPage = Math.min(page ?? internalPage, totalPages);
  const goPage = (p: number) => {
    if (page === undefined) setInternalPage(p);
    onPageChange?.(p);
  };

  const paged = useMemo(
    () => (pageSize ? sorted.slice((curPage - 1) * pageSize, curPage * pageSize) : sorted),
    [sorted, pageSize, curPage],
  );

  const toggleSort = (key: string) =>
    setSort((prev) =>
      prev?.key === key
        ? prev.dir === 'asc'
          ? { key, dir: 'desc' }
          : null
        : { key, dir: 'asc' },
    );

  // Select-all applies to the currently visible (paged) rows.
  const visibleIds = paged.map((r) => r.id);
  const visibleSelectedCount = visibleIds.filter((id) => selectedSet.has(id)).length;
  const allSelected = visibleIds.length > 0 && visibleSelectedCount === visibleIds.length;
  const someSelected = visibleSelectedCount > 0 && !allSelected;

  const toggleAll = () => {
    if (allSelected) setSelected(selected.filter((id) => !visibleIds.includes(id)));
    else setSelected(Array.from(new Set([...selected, ...visibleIds])));
  };
  const toggleRow = (id: string) => {
    if (selectable === 'radio') {
      setSelected(selectedSet.has(id) ? [] : [id]);
    } else {
      setSelected(
        selectedSet.has(id) ? selected.filter((s) => s !== id) : [...selected, id],
      );
    }
  };

  const baseCell: React.CSSProperties = {
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize[14],
    lineHeight: typography.lineHeight[20],
    padding: `14px ${CELL_PAD_INLINE}px`,
  };

  const selectColWidth = 44;
  // 컬럼 구분 세로선(Column-based). 마지막 컬럼 제외, 바깥 테두리는 wrap 담당.
  const colDivider = `1px solid ${color.borderLightLower}`;
  const lastColIdx = columns.length - 1;

  const rowBg = (id: string, state: RowState) => {
    const isSel = selectedSet.has(id);
    const isHover = hoverId === id;
    if (state === 'error') return color.fillCriticalSubtle;
    if (isSel) return isHover ? color.fillAccentLightHovered : color.fillAccentLightLow;
    if (isHover && state !== 'disabled') return color.fillLightLow;
    return color.fillLight;
  };

  return (
    <div className={className}>
      <div
        className="overflow-x-auto"
        style={{ border: `1px solid ${color.borderLightLower}`, borderRadius: 8 }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: color.fillLightLow }}>
              {selectable && (
                <th
                  scope="col"
                  style={{
                    width: selectColWidth,
                    padding: 0,
                    borderBottom: `1px solid ${color.borderLightLower}`,
                    borderRight: colDivider,
                    textAlign: 'center',
                    verticalAlign: 'middle',
                  }}
                >
                  {selectable === 'checkbox' && (
                    <span style={{ display: 'inline-flex', verticalAlign: 'middle' }}>
                      <Checkbox
                        showLabel={false}
                        labelText="전체 선택"
                        selected={allSelected}
                        indeterminate={someSelected}
                        onChange={toggleAll}
                      />
                    </span>
                  )}
                </th>
              )}
              {columns.map((col, ci) => {
                const cid = colId(col);
                const active = sort?.key === cid;
                const align = col.align ?? (col.cellType === 'numericText' ? 'right' : 'left');
                return (
                  <th
                    key={cid}
                    scope="col"
                    style={{
                      ...baseCell,
                      padding: `12px ${CELL_PAD_INLINE}px`,
                      width: col.width,
                      textAlign: align,
                      fontWeight: typography.fontWeight.semibold,
                      color: color.fgDefault,
                      borderBottom: `1px solid ${color.borderLightLower}`,
                      borderRight: ci === lastColIdx ? undefined : colDivider,
                      whiteSpace: 'nowrap',
                    }}
                    aria-sort={
                      active ? (sort!.dir === 'asc' ? 'ascending' : 'descending') : undefined
                    }
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        justifyContent:
                          align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start',
                        width: align === 'right' ? '100%' : undefined,
                      }}
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
                            fontWeight: 'inherit',
                            color: 'inherit',
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          {col.label}
                          <SortIcon dir={active ? sort!.dir : null} />
                        </button>
                      ) : (
                        col.label
                      )}
                      {col.info && (
                        <span title={col.info} style={{ display: 'inline-flex', cursor: 'help' }}>
                          <InfoIcon />
                        </span>
                      )}
                      {col.filterable && (
                        <button
                          type="button"
                          aria-label="필터"
                          style={{
                            display: 'inline-flex',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          <FilterIcon />
                        </button>
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paged.map((row) => {
              const state = rowState?.(row) ?? 'default';
              const disabled = state === 'disabled';
              return (
                <tr
                  key={row.id}
                  onClick={() => !disabled && onRowClick?.(row)}
                  onMouseEnter={() => setHoverId(row.id)}
                  onMouseLeave={() => setHoverId((h) => (h === row.id ? null : h))}
                  style={{
                    borderBottom: `1px solid ${color.borderLightLower}`,
                    cursor: onRowClick && !disabled ? 'pointer' : 'default',
                    backgroundColor: rowBg(row.id, state),
                    transition: 'background-color 120ms ease',
                  }}
                >
                  {selectable && (
                    <td
                      style={{ width: selectColWidth, padding: 0, textAlign: 'center', verticalAlign: 'middle', borderRight: colDivider }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span style={{ display: 'inline-flex', verticalAlign: 'middle' }}>
                        {selectable === 'checkbox' ? (
                          <Checkbox
                            showLabel={false}
                            labelText="행 선택"
                            selected={selectedSet.has(row.id)}
                            state={disabled ? 'disabled' : undefined}
                            onChange={() => toggleRow(row.id)}
                          />
                        ) : (
                          <Radio
                            showLabel={false}
                            labelText="행 선택"
                            selected={selectedSet.has(row.id)}
                            state={disabled ? 'disabled' : undefined}
                            onChange={() => toggleRow(row.id)}
                          />
                        )}
                      </span>
                    </td>
                  )}
                  {columns.map((col, ci) => {
                    const align = col.align ?? (col.cellType === 'numericText' ? 'right' : 'left');
                    const isLink = col.cellType === 'textButton';
                    return (
                      <td
                        key={`${row.id}-${colId(col)}`}
                        style={{
                          ...baseCell,
                          textAlign: align,
                          color: disabled
                            ? color.fgDisabled
                            : isLink
                              ? color.fgAccent
                              : color.fgDefault,
                          borderRight: ci === lastColIdx ? undefined : colDivider,
                          fontVariantNumeric:
                            col.cellType === 'numericText' || align === 'right'
                              ? 'tabular-nums'
                              : undefined,
                        }}
                      >
                        {col.render ? col.render(row) : String(row[col.key] ?? '')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        {paged.length === 0 && (
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

      {pageSize && totalPages > 1 && (
        <Pagination current={curPage} total={totalPages} onChange={goPage} />
      )}
    </div>
  );
}

function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (p: number) => void;
}) {
  const ITEM = 36;
  const itemBase: React.CSSProperties = {
    minWidth: ITEM,
    height: ITEM,
    padding: '0 6px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    border: '1px solid transparent',
    background: 'transparent',
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize[14],
    lineHeight: typography.lineHeight[20],
    color: color.fgDefault,
    cursor: 'pointer',
  };
  const arrow = (dir: 'left' | 'right', disabled: boolean): React.CSSProperties => ({
    ...itemBase,
    color: disabled ? color.fgDisabled : color.fgDefault,
    cursor: disabled ? 'not-allowed' : 'pointer',
  });

  return (
    <nav
      aria-label="페이지네이션"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 16 }}
    >
      <button
        type="button"
        aria-label="이전"
        disabled={current <= 1}
        onClick={() => current > 1 && onChange(current - 1)}
        style={arrow('left', current <= 1)}
      >
        <Chevron dir="left" />
      </button>
      {pageItems(current, total).map((it, i) =>
        it === 'ellipsis' ? (
          <span key={`e${i}`} style={{ ...itemBase, cursor: 'default', color: color.fgLower }}>
            …
          </span>
        ) : (
          <button
            key={it}
            type="button"
            aria-current={it === current ? 'page' : undefined}
            onClick={() => onChange(it)}
            style={{
              ...itemBase,
              border: `1px solid ${it === current ? color.borderAccent : 'transparent'}`,
              color: it === current ? color.fgAccent : color.fgDefault,
              fontWeight:
                it === current ? typography.fontWeight.semibold : typography.fontWeight.regular,
            }}
          >
            {it}
          </button>
        ),
      )}
      <button
        type="button"
        aria-label="다음"
        disabled={current >= total}
        onClick={() => current < total && onChange(current + 1)}
        style={arrow('right', current >= total)}
      >
        <Chevron dir="right" />
      </button>
    </nav>
  );
}
