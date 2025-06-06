const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await page.pdf({ path: 'page.pdf', format: 'A4' });
  await browser.close();
})();
