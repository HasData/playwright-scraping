const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://quotes.toscrape.com');
  const element = await page.$('h1');
  console.log('CSS Selector:', await element.textContent());
  await browser.close();
})();