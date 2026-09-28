const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://the-internet.herokuapp.com/dropdown');

  // Select by value attribute
  await page.selectOption('select#dropdown', '1');
  const chosen = await page.locator('select#dropdown option[selected]').innerText();
  console.log('selected:', chosen);
  await browser.close();
})();
