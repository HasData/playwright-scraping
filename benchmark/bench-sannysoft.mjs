// bench-sannysoft.mjs — counts pass/fail on bot.sannysoft.com for
// default Playwright Chromium vs the same with playwright-extra + stealth.

import { writeFileSync, mkdirSync } from 'node:fs';
import { chromium as pwChromium } from 'playwright';
import { chromium as extraChromium } from 'playwright-extra';
import Stealth from 'puppeteer-extra-plugin-stealth';

async function runAndCount(chromiumApi, label) {
  const browser = await chromiumApi.launch();
  const page = await browser.newPage();
  await page.goto('https://bot.sannysoft.com/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Sannysoft puts results in table cells with class "passed" or "failed".
  const results = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('#fp2 tr, .table tr'));
    const out = [];
    for (const row of rows) {
      const cells = row.querySelectorAll('td');
      if (cells.length < 2) continue;
      const name = cells[0].textContent.trim();
      const second = cells[1];
      const cls = second.className || '';
      const txt = second.textContent.trim();
      out.push({ name, class: cls, text: txt });
    }
    return out;
  });

  await page.screenshot({ path: `sannysoft-${label}.png`, fullPage: true });
  await browser.close();

  const failed = results.filter(r => /failed/i.test(r.class) || /failed/i.test(r.text)).length;
  const passed = results.filter(r => /passed/i.test(r.class) || (/passed/i.test(r.text) && !/failed/i.test(r.text))).length;

  console.log(`\n${label}:`);
  console.log(`  rows total: ${results.length}`);
  console.log(`  passed: ${passed}`);
  console.log(`  failed: ${failed}`);
  console.log(`  screenshot: sannysoft-${label}.png`);
  console.log('  rows:');
  for (const r of results) {
    console.log(`    [${r.class || '-'}] ${r.name}: ${r.text.slice(0, 60)}`);
  }

  return { results, failed, passed };
}

console.log('Test 1: default Playwright Chromium (no stealth)');
const defaultRun = await runAndCount(pwChromium, 'default');

console.log('\nTest 2: Playwright via playwright-extra + Stealth()');
extraChromium.use(Stealth());
const stealthRun = await runAndCount(extraChromium, 'stealth');

mkdirSync('results', { recursive: true });
writeFileSync(`results/sannysoft-${new Date().toISOString().slice(0, 10)}.json`,
  JSON.stringify({
    target: 'https://bot.sannysoft.com',
    node: process.version,
    default: { passed: defaultRun.passed, failed: defaultRun.failed, rows: defaultRun.results },
    stealth: { passed: stealthRun.passed, failed: stealthRun.failed, rows: stealthRun.results },
  }, null, 2));
console.log('raw results written to results/');
