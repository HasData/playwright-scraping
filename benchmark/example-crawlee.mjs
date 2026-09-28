// example-crawlee.mjs — verify the Crawlee CheerioCrawler example in the article.

import { CheerioCrawler } from 'crawlee';

const crawler = new CheerioCrawler({
  maxRequestsPerCrawl: 50,
  async requestHandler({ $, request, enqueueLinks, pushData }) {
    const books = $('article.product_pod').map((_, el) => ({
      title: $(el).find('h3 a').attr('title'),
      price: $(el).find('.price_color').text().trim(),
    })).get();

    await pushData({ url: request.url, count: books.length, books });
    await enqueueLinks({ selector: '.next a' });
  },
});

await crawler.run(['https://books.toscrape.com']);
