// bench-parse.mjs — Cheerio vs jsdom on the same HTML page.
// Measures parse + extract time and heap memory delta per library.

import * as cheerio from 'cheerio';
import { JSDOM } from 'jsdom';
import { performance } from 'node:perf_hooks';
import { writeFileSync, mkdirSync } from 'node:fs';

const TARGET = 'https://books.toscrape.com/catalogue/page-1.html';
const ITERATIONS = 20;

const html = await (await fetch(TARGET)).text();
console.log(`Target: ${TARGET}`);
console.log(`HTML size: ${(html.length / 1024).toFixed(1)} KB`);
console.log(`Iterations per library: ${ITERATIONS}\n`);

function median(arr) {
  const s = [...arr].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

// Warm-up runs so JIT doesn't skew first iteration
for (let i = 0; i < 3; i++) {
  cheerio.load(html);
  new JSDOM(html);
}

// Cheerio
if (global.gc) global.gc();
const cheerioMemBefore = process.memoryUsage().heapUsed;
const cheerioTimes = [];
for (let i = 0; i < ITERATIONS; i++) {
  const start = performance.now();
  const $ = cheerio.load(html);
  const books = $('article.product_pod').map((_, el) => ({
    title: $(el).find('h3 a').attr('title'),
    price: $(el).find('.price_color').text().trim(),
  })).get();
  cheerioTimes.push(performance.now() - start);
}
const cheerioMemAfter = process.memoryUsage().heapUsed;

// jsdom
if (global.gc) global.gc();
const jsdomMemBefore = process.memoryUsage().heapUsed;
const jsdomTimes = [];
for (let i = 0; i < ITERATIONS; i++) {
  const start = performance.now();
  const dom = new JSDOM(html);
  const books = Array.from(dom.window.document.querySelectorAll('article.product_pod')).map(el => ({
    title: el.querySelector('h3 a')?.title,
    price: el.querySelector('.price_color')?.textContent.trim(),
  }));
  jsdomTimes.push(performance.now() - start);
}
const jsdomMemAfter = process.memoryUsage().heapUsed;

const cMed = median(cheerioTimes);
const jMed = median(jsdomTimes);
const cMem = (cheerioMemAfter - cheerioMemBefore) / 1024 / 1024;
const jMem = (jsdomMemAfter - jsdomMemBefore) / 1024 / 1024;

console.log('Parse + extract time (median, ms):');
console.log(`  Cheerio: ${cMed.toFixed(2)} ms`);
console.log(`  jsdom:   ${jMed.toFixed(2)} ms`);
console.log(`  Cheerio is ${(jMed / cMed).toFixed(1)}x faster\n`);

console.log(`Heap delta after ${ITERATIONS} iterations (MB):`);
console.log(`  Cheerio: ${cMem >= 0 ? '+' : ''}${cMem.toFixed(1)} MB`);
console.log(`  jsdom:   ${jMem >= 0 ? '+' : ''}${jMem.toFixed(1)} MB`);
if (cMem > 0 && jMem > 0) {
  console.log(`  jsdom uses ${(jMem / cMem).toFixed(1)}x more heap\n`);
}

// Raw numbers land next to the console output, dated by run day.
mkdirSync('results', { recursive: true });
writeFileSync(`results/parse-${new Date().toISOString().slice(0, 10)}.json`,
  JSON.stringify({
    target: TARGET,
    iterations: ITERATIONS,
    node: process.version,
    median_ms: { cheerio: +cMed.toFixed(2), jsdom: +jMed.toFixed(2) },
    heap_delta_mb: { cheerio: +cMem.toFixed(1), jsdom: +jMem.toFixed(1) },
    runs_ms: { cheerio: cheerioTimes.map(x => +x.toFixed(2)), jsdom: jsdomTimes.map(x => +x.toFixed(2)) },
  }, null, 2));
console.log('raw results written to results/');
