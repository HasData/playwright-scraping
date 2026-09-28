from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("https://the-internet.herokuapp.com/login")

    # The sandbox's published demo credentials
    page.fill("#username", "tomsmith")
    page.fill("#password", "SuperSecretPassword!")
    page.click("button[type=submit]")

    banner = page.text_content("#flash").strip().split("\n")[0]
    print(banner)
    browser.close()
