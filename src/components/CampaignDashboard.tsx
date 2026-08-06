import { useMemo, useState } from 'react';
import { Radio } from './Radio';
import { Switch } from './Switch';
import { TextField } from './TextField';
import { Select } from './Select';
import { Table, type TableColumn } from './Table';
import { Badge, type BadgeTone } from './Badge';
import { Button } from './Button';
import { Segment } from './Segment';
import { color, typography, shadow } from '../tokens';
import {
  ACCOUNTS,
  CAMPAIGNS,
  STATUS_LABEL,
  type Campaign,
  type CampaignStatus,
  ctr,
  cpc,
  cvr,
  fmtCompact,
  fmtInt,
  fmtPct,
  fmtWon,
  totalsOf,
} from '../data/campaigns';

const STATUS_TONE: Record<CampaignStatus, BadgeTone> = {
  active: 'success',
  paused: 'warning',
  scheduled: 'accent',
  ended: 'neutral',
};

const PAGE_SIZE = 5;

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="7.2" cy="7.2" r="4.7" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10.8 10.8L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export function CampaignDashboard() {
  const [accountId, setAccountId] = useState<string>('acc-1');
  const [status, setStatus] = useState('all');
  const [period, setPeriod] = useState('30d');
  const [query, setQuery] = useState('');
  const [showMetrics, setShowMetrics] = useState(true);
  const [activeOnly, setActiveOnly] = useState(false);
  const [view, setView] = useState('performance');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return CAMPAIGNS.filter((c) => {
      if (c.accountId !== accountId) return false;
      if (status !== 'all' && c.status !== status) return false;
      if (activeOnly && c.status !== 'active') return false;
      if (query.trim() && !c.name.toLowerCase().includes(query.trim().toLowerCase()))
        return false;
      return true;
    });
  }, [accountId, status, activeOnly, query]);

  const totals = useMemo(() => totalsOf(filtered), [filtered]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const resetPage = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setPage(1);
  };

  const performanceColumns: TableColumn<Campaign>[] = [
    {
      key: 'name',
      label: '캠페인',
      width: '260px',
      sortable: true,
      render: (c) => (
        <div className="flex flex-col" style={{ gap: 2 }}>
          <span style={{ fontWeight: typography.fontWeight.medium }}>{c.name}</span>
          <span style={{ fontSize: 12, color: color.fgDisabled }}>
            {c.id} · {c.startedAt}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      label: '상태',
      width: '96px',
      sortable: true,
      render: (c) => <Badge tone={STATUS_TONE[c.status]}>{STATUS_LABEL[c.status]}</Badge>,
    },
    {
      key: 'impressions',
      label: '노출',
      width: '100px',
      align: 'right',
      sortable: true,
      render: (c) => fmtCompact(c.impressions),
    },
    {
      key: 'clicks',
      label: '클릭',
      width: '100px',
      align: 'right',
      sortable: true,
      render: (c) => fmtInt(c.clicks),
    },
    {
      key: 'clicks',
      id: 'ctr',
      label: 'CTR',
      width: '84px',
      align: 'right',
      sortable: true,
      sortValue: ctr,
      render: (c) => fmtPct(ctr(c)),
    },
    {
      key: 'conversions',
      label: '전환',
      width: '90px',
      align: 'right',
      sortable: true,
      render: (c) => fmtInt(c.conversions),
    },
    {
      key: 'conversions',
      id: 'cvr',
      label: 'CVR',
      width: '84px',
      align: 'right',
      sortable: true,
      sortValue: cvr,
      render: (c) => fmtPct(cvr(c)),
    },
  ];

  const budgetColumns: TableColumn<Campaign>[] = [
    performanceColumns[0],
    performanceColumns[1],
    {
      key: 'spend',
      label: '집행액',
      width: '130px',
      align: 'right',
      sortable: true,
      render: (c) => fmtWon(c.spend),
    },
    {
      key: 'budget',
      label: '예산',
      width: '130px',
      align: 'right',
      sortable: true,
      render: (c) => fmtWon(c.budget),
    },
    {
      key: 'spend',
      id: 'burn',
      label: '소진율',
      width: '150px',
      align: 'right',
      sortable: true,
      sortValue: (c) => c.spend / c.budget,
      render: (c) => {
        const rate = c.budget === 0 ? 0 : c.spend / c.budget;
        return (
          <div className="flex items-center justify-end" style={{ gap: 8 }}>
            <div
              style={{
                width: 64,
                height: 6,
                borderRadius: 3,
                backgroundColor: color.fillSubtle,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${Math.min(100, rate * 100)}%`,
                  height: '100%',
                  backgroundColor: rate >= 0.9 ? color.fgWarning : color.fillAccent,
                }}
              />
            </div>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{fmtPct(rate)}</span>
          </div>
        );
      },
    },
    {
      key: 'clicks',
      id: 'cpc',
      label: 'CPC',
      width: '110px',
      align: 'right',
      sortable: true,
      sortValue: cpc,
      render: (c) => fmtWon(cpc(c)),
    },
  ];

  const metricCards = [
    { label: '노출', value: fmtCompact(totals.impressions) },
    { label: '클릭', value: fmtInt(totals.clicks) },
    { label: 'CTR', value: fmtPct(totals.ctr) },
    { label: '전환', value: fmtInt(totals.conversions) },
    { label: '집행액', value: fmtWon(totals.spend) },
    { label: 'CPC', value: fmtWon(totals.cpc) },
  ];

  const cardStyle: React.CSSProperties = {
    backgroundColor: color.fillLight,
    border: `1px solid ${color.borderDefault}`,
    borderRadius: 8,
    boxShadow: shadow.card,
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <header
        style={{
          backgroundColor: color.fillLight,
          borderBottom: `1px solid ${color.borderDefault}`,
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}
      >
        <div className="mx-auto flex items-center justify-between" style={{ maxWidth: 1280, padding: '20px 24px' }}>
          <div>
            <h1
              style={{
                margin: 0,
                fontFamily: typography.fontFamily,
                fontSize: typography.fontSize[24],
                lineHeight: typography.lineHeight[32],
                fontWeight: typography.fontWeight.bold,
                color: color.fgDefault,
              }}
            >
              캠페인 관리
            </h1>
            <p
              style={{
                margin: '4px 0 0',
                fontFamily: typography.fontFamily,
                fontSize: typography.fontSize[14],
                lineHeight: typography.lineHeight[20],
                color: color.fgSubtle,
              }}
            >
              상품광고 · 디스플레이 광고 플랫폼
            </p>
          </div>
          <Button variant="primary">캠페인 만들기</Button>
        </div>
      </header>

      <main className="mx-auto" style={{ maxWidth: 1280, padding: '24px' }}>
        {/* Filters */}
        <section style={{ ...cardStyle, padding: 24, marginBottom: 24 }}>
          <div className="flex flex-wrap items-center justify-between" style={{ gap: 16, marginBottom: 20 }}>
            <h2
              style={{
                margin: 0,
                fontFamily: typography.fontFamily,
                fontSize: typography.fontSize[16],
                lineHeight: typography.lineHeight[24],
                fontWeight: typography.fontWeight.semibold,
                color: color.fgDefault,
              }}
            >
              필터
            </h2>
            <Switch
              id="active-only"
              labelText="운영중만 보기"
              showLabel
              size="20"
              selected={activeOnly}
              onChange={resetPage(setActiveOnly)}
            />
          </div>

          <fieldset style={{ border: 'none', padding: 0, margin: '0 0 20px' }}>
            <legend
              style={{
                padding: 0,
                marginBottom: 8,
                fontFamily: typography.fontFamily,
                fontSize: typography.fontSize[14],
                lineHeight: typography.lineHeight[20],
                fontWeight: typography.fontWeight.medium,
                color: color.fgDefault,
              }}
            >
              광고 계정
            </legend>
            <div role="radiogroup" aria-label="광고 계정" className="flex flex-wrap" style={{ gap: 24 }}>
              {ACCOUNTS.map((a) => (
                <Radio
                  key={a.value}
                  id={`account-${a.value}`}
                  name="account"
                  labelText={a.label}
                  selected={accountId === a.value}
                  onChange={() => resetPage(setAccountId)(a.value)}
                />
              ))}
            </div>
          </fieldset>

          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 16 }}>
            <Select
              id="status"
              label="상태"
              value={status}
              onChange={resetPage(setStatus)}
              options={[
                { value: 'all', label: '전체' },
                { value: 'active', label: '운영중' },
                { value: 'paused', label: '일시정지' },
                { value: 'scheduled', label: '예약' },
                { value: 'ended', label: '종료' },
              ]}
            />
            <Select
              id="period"
              label="기간"
              value={period}
              onChange={setPeriod}
              options={[
                { value: '7d', label: '최근 7일' },
                { value: '30d', label: '최근 30일' },
                { value: '90d', label: '최근 90일' },
                { value: 'all', label: '전체 기간' },
              ]}
            />
            <TextField
              id="search"
              label="캠페인 검색"
              placeholder="캠페인명을 입력하세요"
              value={query}
              onChange={resetPage(setQuery)}
              leadingIcon={<SearchIcon />}
            />
          </div>
        </section>

        {/* Metrics */}
        <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <h2
            style={{
              margin: 0,
              fontFamily: typography.fontFamily,
              fontSize: typography.fontSize[16],
              lineHeight: typography.lineHeight[24],
              fontWeight: typography.fontWeight.semibold,
              color: color.fgDefault,
            }}
          >
            지표 요약
          </h2>
          <Switch
            id="show-metrics"
            labelText="지표 표시"
            showLabel
            selected={showMetrics}
            onChange={setShowMetrics}
          />
        </div>

        {showMetrics && (
          <section
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
            style={{ gap: 16, marginBottom: 24 }}
          >
            {metricCards.map((m) => (
              <div key={m.label} style={{ ...cardStyle, padding: 16 }}>
                <p
                  style={{
                    margin: 0,
                    fontFamily: typography.fontFamily,
                    fontSize: typography.fontSize[12],
                    lineHeight: typography.lineHeight[16],
                    color: color.fgSubtle,
                  }}
                >
                  {m.label}
                </p>
                <p
                  style={{
                    margin: '6px 0 0',
                    fontFamily: typography.fontFamily,
                    fontSize: typography.fontSize[20],
                    lineHeight: typography.lineHeight[28],
                    fontWeight: typography.fontWeight.bold,
                    color: color.fgDefault,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {m.value}
                </p>
              </div>
            ))}
          </section>
        )}

        {/* Table */}
        <section style={{ ...cardStyle, padding: 24 }}>
          <div className="flex flex-wrap items-center justify-between" style={{ gap: 16, marginBottom: 16 }}>
            <h2
              style={{
                margin: 0,
                fontFamily: typography.fontFamily,
                fontSize: typography.fontSize[16],
                lineHeight: typography.lineHeight[24],
                fontWeight: typography.fontWeight.semibold,
                color: color.fgDefault,
              }}
            >
              캠페인 목록{' '}
              <span style={{ color: color.fgSubtle, fontWeight: typography.fontWeight.regular }}>
                ({filtered.length})
              </span>
            </h2>
            <Segment
              ariaLabel="테이블 보기"
              value={view}
              onChange={setView}
              items={[
                { value: 'performance', label: '성과' },
                { value: 'budget', label: '예산' },
              ]}
            />
          </div>

          <Table
            columns={view === 'performance' ? performanceColumns : budgetColumns}
            data={pageRows}
            onRowClick={(c) => console.info('캠페인 선택:', c.id)}
            emptyMessage="조건에 맞는 캠페인이 없습니다"
          />

          <div
            className="flex flex-wrap items-center justify-between"
            style={{ gap: 12, marginTop: 16 }}
          >
            <span
              style={{
                fontFamily: typography.fontFamily,
                fontSize: typography.fontSize[14],
                lineHeight: typography.lineHeight[20],
                color: color.fgSubtle,
              }}
            >
              {filtered.length === 0
                ? '0건'
                : `${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, filtered.length)} / ${filtered.length}건`}
            </span>
            <div className="flex items-center" style={{ gap: 8 }}>
              <Button size="sm" disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}>
                이전
              </Button>
              <span
                style={{
                  fontFamily: typography.fontFamily,
                  fontSize: typography.fontSize[14],
                  color: color.fgSubtle,
                  padding: '0 4px',
                }}
              >
                {safePage} / {pageCount}
              </span>
              <Button
                size="sm"
                variant="primary"
                disabled={safePage >= pageCount}
                onClick={() => setPage(safePage + 1)}
              >
                다음
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
