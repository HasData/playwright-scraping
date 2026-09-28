from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("https://quotes.toscrape.com")

    pages_visited = 1
    while page.locator("li.next a").count() > 0 and pages_visited < 4:
        page.click("li.next a")
        page.wait_for_selector(".quote")
        pages_visited += 1
        print("now at:", page.url)

    print(f"walked {pages_visited} pages")
    browser.close()
