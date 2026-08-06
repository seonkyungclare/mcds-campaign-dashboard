export type CampaignStatus = 'active' | 'paused' | 'scheduled' | 'ended';

export interface Campaign {
  id: string;
  name: string;
  accountId: string;
  status: CampaignStatus;
  /** Raw numbers — formatting happens at render time. */
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  budget: number;
  startedAt: string;
}

export const ACCOUNTS = [
  { value: 'acc-1', label: '무신사 스토어' },
  { value: 'acc-2', label: '무신사 뷰티' },
  { value: 'acc-3', label: '29CM' },
] as const;

export const STATUS_LABEL: Record<CampaignStatus, string> = {
  active: '운영중',
  paused: '일시정지',
  scheduled: '예약',
  ended: '종료',
};

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'c-001',
    name: '여름 시즌오프 디스플레이',
    accountId: 'acc-1',
    status: 'active',
    impressions: 1_248_320,
    clicks: 45_812,
    conversions: 2_431,
    spend: 4_120_000,
    budget: 5_000_000,
    startedAt: '2026-06-01',
  },
  {
    id: 'c-002',
    name: 'SS 신상 브랜드관 오픈',
    accountId: 'acc-1',
    status: 'active',
    impressions: 890_140,
    clicks: 32_507,
    conversions: 1_804,
    spend: 2_980_000,
    budget: 3_500_000,
    startedAt: '2026-06-14',
  },
  {
    id: 'c-003',
    name: '브랜드 인지도 확대 캠페인',
    accountId: 'acc-2',
    status: 'paused',
    impressions: 452_900,
    clicks: 12_311,
    conversions: 648,
    spend: 1_240_000,
    budget: 2_000_000,
    startedAt: '2026-05-20',
  },
  {
    id: 'c-004',
    name: '장바구니 이탈 리타게팅',
    accountId: 'acc-1',
    status: 'active',
    impressions: 2_104_770,
    clicks: 78_402,
    conversions: 3_215,
    spend: 6_310_000,
    budget: 7_000_000,
    startedAt: '2026-04-02',
  },
  {
    id: 'c-005',
    name: '앱 신규설치 유도',
    accountId: 'acc-3',
    status: 'scheduled',
    impressions: 230_450,
    clicks: 6_840,
    conversions: 341,
    spend: 890_000,
    budget: 1_500_000,
    startedAt: '2026-08-15',
  },
  {
    id: 'c-006',
    name: '뷰티 카테고리 상단 노출',
    accountId: 'acc-2',
    status: 'active',
    impressions: 671_220,
    clicks: 24_930,
    conversions: 1_192,
    spend: 2_150_000,
    budget: 2_400_000,
    startedAt: '2026-07-01',
  },
  {
    id: 'c-007',
    name: '29CM 리빙 기획전',
    accountId: 'acc-3',
    status: 'ended',
    impressions: 318_005,
    clicks: 9_112,
    conversions: 402,
    spend: 1_000_000,
    budget: 1_000_000,
    startedAt: '2026-03-10',
  },
];

/* ---------- derived metrics ---------- */

export const ctr = (c: Campaign) => (c.impressions === 0 ? 0 : c.clicks / c.impressions);
export const cvr = (c: Campaign) => (c.clicks === 0 ? 0 : c.conversions / c.clicks);
export const cpc = (c: Campaign) => (c.clicks === 0 ? 0 : c.spend / c.clicks);

export interface Totals {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number;
  cpc: number;
}

export function totalsOf(list: Campaign[]): Totals {
  const t = list.reduce(
    (acc, c) => ({
      impressions: acc.impressions + c.impressions,
      clicks: acc.clicks + c.clicks,
      conversions: acc.conversions + c.conversions,
      spend: acc.spend + c.spend,
    }),
    { impressions: 0, clicks: 0, conversions: 0, spend: 0 },
  );
  return {
    ...t,
    ctr: t.impressions === 0 ? 0 : t.clicks / t.impressions,
    cpc: t.clicks === 0 ? 0 : t.spend / t.clicks,
  };
}

/* ---------- formatters ---------- */

const nf = new Intl.NumberFormat('ko-KR');

export const fmtInt = (n: number) => nf.format(Math.round(n));
export const fmtPct = (r: number) => `${(r * 100).toFixed(2)}%`;
export const fmtWon = (n: number) => `₩${nf.format(Math.round(n))}`;
export const fmtCompact = (n: number) => {
  if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(1)}억`;
  if (n >= 10_000) return `${(n / 10_000).toFixed(1)}만`;
  return nf.format(n);
};
