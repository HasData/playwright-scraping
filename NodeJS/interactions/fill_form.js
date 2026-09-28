const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://the-internet.herokuapp.com/login');

  // The sandbox's published demo credentials
  await page.fill('#username', 'tomsmith');
  await page.fill('#password', 'SuperSecretPassword!');
  await page.click('button[type=submit]');

  const banner = (await page.textContent('#flash')).trim().split('\n')[0];
  console.log(banner);
  await browser.close();
})();
