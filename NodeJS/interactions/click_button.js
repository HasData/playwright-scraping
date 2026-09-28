const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://the-internet.herokuapp.com/add_remove_elements/');

  // Each click adds a Delete button to the page
  await page.click("button[onclick='addElement()']");
  await page.click("button[onclick='addElement()']");
  const added = await page.locator('#elements button').count();
  console.log(`buttons after two clicks: ${added}`);
  await browser.close();
})();
