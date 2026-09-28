// example-playwright.mjs — verify the Playwright example in the article works.

import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('https://quotes.toscrape.com/js/');

const quotes = await page.locator('.quote').evaluateAll(els =>
  els.map(el => ({
    text: el.querySelector('.text').textContent,
    author: el.querySelector('.author').textContent,
  }))
);

console.log(JSON.stringify(quotes.slice(0, 2), null, 2));
await browser.close();
