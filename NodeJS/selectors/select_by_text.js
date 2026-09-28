const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://quotes.toscrape.com');
  const element = await page.getByText('Quotes to Scrape');
  console.log('By Text:', await element.textContent());
  await browser.close();
})();