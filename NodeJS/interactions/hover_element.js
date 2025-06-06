const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await page.hover('.tooltip-target');
  console.log(await page.content());
  await browser.close();
})();
