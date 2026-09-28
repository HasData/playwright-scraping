const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://quotes.toscrape.com');
  const element = await page.locator('h1');
  await element.screenshot({ path: 'element.png' });
  await browser.close();
})();