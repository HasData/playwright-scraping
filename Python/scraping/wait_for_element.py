from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("https://quotes.toscrape.com")
    page.wait_for_selector("h1")
    print("Found:", page.text_content("h1"))
    browser.close()
