from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("https://quotes.toscrape.com")
        element = page.get_by_text("Quotes to Scrape")
        print("By Text:", element.inner_text())
        browser.close()

run()
