// example-hasdata.mjs — HasData Web Scraping API + Cheerio extraction.
// Run: HASDATA_API_KEY=... node example-hasdata.mjs

import * as cheerio from 'cheerio';

const res = await fetch('https://api.hasdata.com/scrape/web', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.HASDATA_API_KEY,
  },
  body: JSON.stringify({
    url: 'https://quotes.toscrape.com/js/',
    jsRendering: true,
    proxyType: 'residential',
  }),
});

const { content } = await res.json();
const $ = cheerio.load(content);

const quotes = $('.quote').map((_, el) => ({
  text: $(el).find('.text').text(),
  author: $(el).find('.author').text(),
})).get();

console.log(JSON.stringify(quotes.slice(0, 2), null, 2));
