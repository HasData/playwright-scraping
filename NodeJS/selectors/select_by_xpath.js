const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://quotes.toscrape.com');
  const [element] = await page.$x('//h1');
  console.log('XPath Selector:', await element.textContent());
  await browser.close();
})();