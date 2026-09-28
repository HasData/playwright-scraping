// example-puppeteer.mjs — verify the Puppeteer example in the article works.

import puppeteer from 'puppeteer';

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto('https://quotes.toscrape.com/js/');

const quotes = await page.$$eval('.quote', els =>
  els.map(el => ({
    text: el.querySelector('.text').textContent,
    author: el.querySelector('.author').textContent,
  }))
);

console.log(JSON.stringify(quotes.slice(0, 2), null, 2));
await browser.close();
