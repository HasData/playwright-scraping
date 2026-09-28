from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("https://quotes.toscrape.com")
        element = page.query_selector("h1")
        print("CSS Selector:", element.inner_text())
        browser.close()

run()