const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://the-internet.herokuapp.com/hovers');

  // The caption is display:none until its figure is hovered
  await page.hover('.figure:nth-of-type(1)');
  const caption = await page.textContent('.figure:nth-of-type(1) .figcaption h5');
  console.log('revealed:', caption);
  await browser.close();
})();
