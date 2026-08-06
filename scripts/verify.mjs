import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';

const root = new URL('../dist', import.meta.url).pathname;
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml' };
const server = http.createServer((req, res) => {
  let p = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) p = path.join(root, 'index.html');
  res.writeHead(200, { 'Content-Type': mime[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(4321, r));

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

const errors = [];
page.on('console', m => { if ((m.type() === 'error' || m.type() === 'warning') && !m.text().includes('Failed to load resource')) errors.push(`[${m.type()}] ${m.text()}`); });
page.on('pageerror', e => errors.push(`[pageerror] ${e.message}`));

await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);

// --- assertions ---
const results = [];
const check = (name, ok, detail='') => results.push({ name, ok, detail });

check('h1 렌더', (await page.locator('h1').innerText()).includes('캠페인 관리'));
check('기본 계정(무신사 스토어) 행 수 = 3', (await page.locator('tbody tr').count()) === 3, `실제 ${await page.locator('tbody tr').count()}`);

// Switch geometry (size 24 = 40x24, handle 18)
const sw = page.locator('button[role=switch]').last();
const swBox = await sw.boundingBox();
check('Switch 24 크기 40x24', Math.round(swBox.width)===40 && Math.round(swBox.height)===24, `${swBox.width}x${swBox.height}`);
const handle = sw.locator('span');
const hBox = await handle.boundingBox();
check('Switch 핸들 18x18', Math.round(hBox.width)===18 && Math.round(hBox.height)===18, `${hBox.width}x${hBox.height}`);
const onOffset = Math.round(hBox.x - swBox.x);
check('Switch ON 핸들 위치 19px', onOffset===19, `${onOffset}px`);
await sw.click(); await page.waitForTimeout(300);
const hBox2 = await sw.locator('span').boundingBox();
check('Switch OFF 핸들 위치 3px', Math.round(hBox2.x - swBox.x)===3, `${Math.round(hBox2.x-swBox.x)}px`);
await sw.click(); await page.waitForTimeout(300);

// Radio geometry 20x20
const radio = page.locator('button[role=radio]').first();
const rBox = await radio.boundingBox();
check('Radio 20x20', Math.round(rBox.width)===20 && Math.round(rBox.height)===20, `${rBox.width}x${rBox.height}`);

// MCDS accent color actually applied
const accent = await page.locator('button[role=radio][aria-checked=true]').first()
  .evaluate(el => getComputedStyle(el).backgroundColor);
check('Radio accent = #2b52f0', accent === 'rgb(43, 82, 240)', accent);

// Filter: switching account changes rows
await page.locator('label[for="account-acc-3"]').click(); await page.waitForTimeout(250);
const acc3Rows = await page.locator('tbody tr').count();
check('계정 필터 동작 (29CM = 2건)', acc3Rows === 2, `${acc3Rows}건`);
await page.locator('label[for="account-acc-1"]').click(); await page.waitForTimeout(250);

// Search filter
await page.locator('#search').fill('리타게팅'); await page.waitForTimeout(300);
const searchRows = await page.locator('tbody tr').count();
check('검색 필터 동작', searchRows === 1, `${searchRows}건`);
await page.locator('#search').fill(''); await page.waitForTimeout(300);

// Metrics recompute with filter (not hardcoded)
const before = await page.locator('main section p').nth(1).innerText();
await page.locator('label[for="account-acc-2"]').click(); await page.waitForTimeout(300);
const after = await page.locator('main section p').nth(1).innerText();
check('지표가 필터에 반응 (하드코딩 아님)', before !== after, `${before} -> ${after}`);
await page.locator('label[for="account-acc-1"]').click(); await page.waitForTimeout(300);

// Select dropdown opens & selects
await page.locator('#status').click(); await page.waitForTimeout(250);
check('Select 드롭다운 열림', await page.locator('ul[role=listbox]').isVisible());
await page.locator('ul[role=listbox] button', { hasText: '일시정지' }).click(); await page.waitForTimeout(300);
check('Select 선택 반영', (await page.locator('#status').innerText()).includes('일시정지'));
await page.locator('#status').click(); await page.waitForTimeout(200);
await page.locator('ul[role=listbox] button', { hasText: '전체' }).first().click(); await page.waitForTimeout(300);

// Segment switches columns
await page.locator('button[role=tab]', { hasText: '예산' }).click(); await page.waitForTimeout(300);
check('Segment 예산 뷰 전환', (await page.locator('thead th').allInnerTexts()).some(t => t.includes('소진율')));
await page.locator('button[role=tab]', { hasText: '성과' }).click(); await page.waitForTimeout(300);

// Sorting
await page.locator('thead th button', { hasText: 'CTR' }).click(); await page.waitForTimeout(300);
check('CTR 정렬 동작', (await page.locator('thead th[aria-sort]').count()) === 1);

await page.screenshot({ path: new URL('../dashboard.png', import.meta.url).pathname, fullPage: true });

console.log('\n===== 검증 결과 =====');
for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? '  ('+r.detail+')' : ''}`);
console.log(`\n합계: ${results.filter(r=>r.ok).length}/${results.length} 통과`);
console.log('\n===== 콘솔 에러/경고 =====');
console.log(errors.length ? errors.join('\n') : '(없음)');

await browser.close();
server.close();
process.exit(results.every(r=>r.ok) && errors.length===0 ? 0 : 1);
