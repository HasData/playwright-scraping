from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("https://example.com")
    element = page.locator("h1")
    element.screenshot(path="element.png")
    browser.close()