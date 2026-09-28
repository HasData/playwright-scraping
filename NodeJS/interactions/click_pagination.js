const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://quotes.toscrape.com');

  let pagesVisited = 1;
  while (await page.locator('li.next a').count() > 0 && pagesVisited < 4) {
    await page.click('li.next a');
    await page.waitForSelector('.quote');
    pagesVisited += 1;
    console.log('now at:', page.url());
  }

  console.log(`walked ${pagesVisited} pages`);
  await browser.close();
})();
