const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  await context.tracing.start({ screenshots: true, snapshots: true, sources: true });

  const page = await context.newPage();
  await page.goto('https://example.com');
  await page.waitForTimeout(2000);

  await context.tracing.stop({ path: 'trace.zip' });
  await browser.close();
})();
