const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://the-internet.herokuapp.com/infinite_scroll');

  for (let step = 1; step <= 4; step++) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    const loaded = await page.locator('.jscroll-added').count();
    console.log(`after scroll ${step}: ${loaded} loaded blocks`);
  }

  await browser.close();
})();
