// bench-browser-mem.mjs — Memory footprint of headless Chromium under Playwright vs Puppeteer.
// PID-aware: capture chrome/headless pids before launch, measure RSS of only the NEW pids.

import { writeFileSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { performance } from 'node:perf_hooks';

function chromePids() {
  const cmd = `powershell.exe -NoProfile -Command "Get-Process | Where-Object { $_.ProcessName -match 'chrome|headless' } | Select-Object -ExpandProperty Id"`;
  try {
    const out = execSync(cmd, { encoding: 'utf8' }).trim();
    if (!out) return new Set();
    return new Set(out.split(/\r?\n/).map(s => parseInt(s.trim())).filter(Boolean));
  } catch (e) {
    return new Set();
  }
}

function rssForPids(pids) {
  if (!pids.size) return 0;
  const idList = [...pids].join(',');
  const cmd = `powershell.exe -NoProfile -Command "Get-Process -Id ${idList} -ErrorAction SilentlyContinue | Measure-Object -Sum WorkingSet64 | Select-Object -ExpandProperty Sum"`;
  try {
    const out = execSync(cmd, { encoding: 'utf8' }).trim();
    if (!out) return 0;
    return parseInt(out) / 1024 / 1024;
  } catch (e) {
    return 0;
  }
}

console.log(`Existing chrome/headless PIDs at start: ${chromePids().size}\n`);

async function benchPlaywright() {
  const { chromium } = await import('playwright');
  const before = chromePids();
  const t0 = performance.now();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('about:blank');
  const launchTime = performance.now() - t0;
  await new Promise(r => setTimeout(r, 2000));
  const after = chromePids();
  const newPids = new Set([...after].filter(p => !before.has(p)));
  const rss = rssForPids(newPids);
  await browser.close();
  await new Promise(r => setTimeout(r, 2000));
  return { launchTime, rss, pidCount: newPids.size };
}

async function benchPuppeteer() {
  const puppeteer = (await import('puppeteer')).default;
  const before = chromePids();
  const t0 = performance.now();
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('about:blank');
  const launchTime = performance.now() - t0;
  await new Promise(r => setTimeout(r, 2000));
  const after = chromePids();
  const newPids = new Set([...after].filter(p => !before.has(p)));
  const rss = rssForPids(newPids);
  await browser.close();
  await new Promise(r => setTimeout(r, 2000));
  return { launchTime, rss, pidCount: newPids.size };
}

function median(arr) {
  const s = [...arr].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

const ITERATIONS = 5;

console.log(`Playwright headless Chromium (${ITERATIONS} runs):`);
const pwRuns = [];
for (let i = 0; i < ITERATIONS; i++) {
  const r = await benchPlaywright();
  pwRuns.push(r);
  console.log(`  run ${i + 1}: ${r.launchTime.toFixed(0)} ms launch, ${r.rss.toFixed(0)} MB RSS (${r.pidCount} new pids)`);
}

console.log(`\nPuppeteer headless Chrome (${ITERATIONS} runs):`);
const ppRuns = [];
for (let i = 0; i < ITERATIONS; i++) {
  const r = await benchPuppeteer();
  ppRuns.push(r);
  console.log(`  run ${i + 1}: ${r.launchTime.toFixed(0)} ms launch, ${r.rss.toFixed(0)} MB RSS (${r.pidCount} new pids)`);
}

const pwLaunch = median(pwRuns.map(r => r.launchTime));
const ppLaunch = median(ppRuns.map(r => r.launchTime));
const pwRss = median(pwRuns.map(r => r.rss));
const ppRss = median(ppRuns.map(r => r.rss));

console.log('\nMedian summary:');
console.log(`  Cold start:  Playwright ${pwLaunch.toFixed(0)} ms vs Puppeteer ${ppLaunch.toFixed(0)} ms (${(ppLaunch / pwLaunch).toFixed(1)}x ratio)`);
console.log(`  Browser RAM: Playwright ${pwRss.toFixed(0)} MB vs Puppeteer ${ppRss.toFixed(0)} MB (${(ppRss / pwRss).toFixed(1)}x ratio)`);

mkdirSync('results', { recursive: true });
writeFileSync(`results/browser-mem-${new Date().toISOString().slice(0, 10)}.json`,
  JSON.stringify({
    iterations: ITERATIONS,
    node: process.version,
    median: {
      launch_ms: { playwright: +pwLaunch.toFixed(0), puppeteer: +ppLaunch.toFixed(0) },
      rss_mb: { playwright: +pwRss.toFixed(0), puppeteer: +ppRss.toFixed(0) },
    },
    runs: { playwright: pwRuns, puppeteer: ppRuns },
  }, null, 2));
console.log('raw results written to results/');
