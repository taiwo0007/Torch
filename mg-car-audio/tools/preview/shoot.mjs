#!/usr/bin/env node
// Usage: node tools/preview/shoot.mjs [template ...] [render options] [--only mobile|desktop]
// Renders the templates (default: index, page.service, page.car-make, page.quote, page.contact),
// serves the repo over a local http server and writes full-page screenshots:
//   tools/preview/out/<template>-mobile.png   (390x844 viewport, full page)
//   tools/preview/out/<template>-desktop.png  (1440x900 viewport, full page)
// Render options are the same as render.mjs (--all, --home-fallback, --sections a,b --name x, ...).

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { chromium } from 'playwright';
import { parseArgs, renderMany } from './render.mjs';
import { formatReport, REPO_DIR, PREVIEW_DIR } from './lib/theme.mjs';
import { startStaticServer } from './lib/server.mjs';

const FONT_CACHE = path.join(PREVIEW_DIR, '.cache', 'fonts');

/** Serve Google Fonts from a disk cache (filled on first use, with retries) so runs are stable/offline-friendly. */
async function routeFonts(context) {
  await context.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, async (route) => {
    const url = route.request().url();
    const file = path.join(FONT_CACHE, crypto.createHash('sha1').update(url).digest('hex'));
    try {
      if (fs.existsSync(file) && fs.existsSync(file + '.json')) {
        const meta = JSON.parse(fs.readFileSync(file + '.json', 'utf8'));
        return await route.fulfill({ status: 200, headers: meta.headers, body: fs.readFileSync(file) });
      }
      const res = await route.fetch({ maxRetries: 3, timeout: 20000 });
      const body = await res.body();
      const h = res.headers();
      const headers = { 'content-type': h['content-type'] || 'application/octet-stream', 'access-control-allow-origin': '*' };
      if (res.ok()) {
        fs.mkdirSync(FONT_CACHE, { recursive: true });
        fs.writeFileSync(file, body);
        fs.writeFileSync(file + '.json', JSON.stringify({ url, headers }));
      }
      return await route.fulfill({ status: res.status(), headers, body });
    } catch {
      return route.abort().catch(() => {});
    }
  });
}

const VIEWPORTS = {
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true },
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
};

// Horizon locks <html> to 100dvh and scrolls inside .page-wrapper on desktop, which would make a
// "full page" screenshot only one viewport tall. Unlock it for screenshots only.
const SCREENSHOT_CSS = `
  html:has(.page-wrapper), html:has(.page-wrapper) body, .page-wrapper { height: auto !important; overflow: visible !important; }
  html { scroll-behavior: auto !important; }
`;

/** Use Playwright's bundled browser if it matches, else any Chromium under PLAYWRIGHT_BROWSERS_PATH. */
function resolveExecutable() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  try {
    if (fs.existsSync(chromium.executablePath())) return undefined;
  } catch {
    /* fall through */
  }
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  const candidates = [];
  for (const dir of fs.existsSync(root) ? fs.readdirSync(root) : []) {
    for (const rel of ['chrome-linux/headless_shell', 'chrome-linux/chrome', 'chrome-linux64/chrome', 'chrome-headless-shell-linux64/chrome-headless-shell']) {
      const p = path.join(root, dir, rel);
      if (/^chromium/.test(dir) && fs.existsSync(p)) candidates.push({ p, rev: Number(dir.split('-').pop()) || 0, shell: dir.includes('headless_shell') });
    }
  }
  candidates.sort((a, b) => b.rev - a.rev || Number(b.shell) - Number(a.shell));
  if (!candidates.length) throw new Error(`No Chromium found. Playwright expected ${chromium.executablePath()}; nothing usable under ${root}.`);
  return candidates[0].p;
}

async function settle(page) {
  await page.addStyleTag({ content: SCREENSHOT_CSS });
  // Load lazy images: make them eager, then walk the page once.
  await page.evaluate(async () => {
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => (img.loading = 'eager'));
    const step = Math.max(200, window.innerHeight * 0.8);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 30));
    }
    window.scrollTo(0, 0);
    await document.fonts.ready;
    await Promise.all(
      [...document.images].filter((img) => !img.complete).map((img) => new Promise((r) => { img.addEventListener('load', r, { once: true }); img.addEventListener('error', r, { once: true }); setTimeout(r, 8000); }))
    );
  });
  await page.waitForTimeout(250);
}

async function main() {
  const argv = process.argv.slice(2);
  let only = null;
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--only') only = argv[++i];
    else rest.push(argv[i]);
  }
  const opts = parseArgs(rest);
  const rel = (p) => path.relative(process.cwd(), p) || p;

  const reports = await renderMany(opts);
  for (const r of reports) console.log(formatReport(r, rel) + '\n');

  const server = await startStaticServer(REPO_DIR);
  const executablePath = resolveExecutable();
  const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  // Playwright normally forces loopback traffic through the proxy too (<-loopback>); we need the
  // local preview server to be reached directly.
  if (proxy) process.env.PLAYWRIGHT_DISABLE_FORCED_CHROMIUM_PROXIED_LOOPBACK = '1';
  const browser = await chromium.launch({
    headless: true,
    ...(executablePath ? { executablePath } : {}),
    // Remote fonts (Google Fonts) go through the sandbox proxy when one is configured.
    ...(proxy ? { proxy: { server: proxy, bypass: '127.0.0.1,localhost' } } : {}),
  });

  const shots = [];
  const problems = [];
  try {
    for (const report of reports) {
      const base = path.basename(report.output, '.html');
      const url = `${server.url}/${path.relative(REPO_DIR, report.output).split(path.sep).join('/')}`;
      for (const [name, device] of Object.entries(VIEWPORTS)) {
        if (only && only !== name) continue;
        const context = await browser.newContext({ ...device, ignoreHTTPSErrors: true });
        await routeFonts(context);
        const page = await context.newPage();
        const issues = [];
        page.on('pageerror', (e) => issues.push(`page error: ${e.message.split('\n')[0]}`));
        page.on('console', (m) => m.type() === 'error' && issues.push(`console: ${m.text().split('\n')[0]}`));
        page.on('requestfailed', (r) => issues.push(`request failed: ${r.url().slice(0, 140)} (${r.failure()?.errorText})`));
        page.on('response', (r) => r.status() >= 400 && r.url().startsWith(server.url) && issues.push(`HTTP ${r.status()}: ${r.url().replace(server.url, '')}`));
        await page.goto(url, { waitUntil: 'load', timeout: 60000 });
        await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
        await settle(page);
        const out = path.join(path.dirname(report.output), `${base}-${name}.png`);
        await page.screenshot({ path: out, fullPage: true, animations: 'disabled' });
        const dims = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.scrollHeight]);
        shots.push({ out, dims, name });
        const uniq = [...new Set(issues)];
        if (uniq.length) problems.push({ page: `${base} (${name})`, issues: uniq });
        await context.close();
      }
    }
  } finally {
    await browser.close();
    await server.close();
  }

  console.log('Screenshots:');
  for (const s of shots) {
    const overflow = s.name === 'mobile' && s.dims[0] > 390 ? `  <- horizontal overflow: page is ${s.dims[0]}px wide` : '';
    console.log(`  ${rel(s.out)}  (${s.dims[0]}x${s.dims[1]} css px)${overflow}`);
  }
  if (problems.length) {
    console.log('\nBrowser issues:');
    for (const p of problems) {
      console.log(`  ${p.page}`);
      for (const i of p.issues.slice(0, 15)) console.log(`    - ${i}`);
      if (p.issues.length > 15) console.log(`    ... ${p.issues.length - 15} more`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
