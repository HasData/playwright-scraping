const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://quotes.toscrape.com');
  const heading = await page.getByRole('heading', { level: 1 });
  console.log('By Role:', await heading.textContent());
  await browser.close();
})();