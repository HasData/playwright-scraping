from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("https://the-internet.herokuapp.com/infinite_scroll")

    for step in range(4):
        page.evaluate("window.scrollTo(0, document.body.scrollHeight);")
        page.wait_for_timeout(1000)
        loaded = page.locator(".jscroll-added").count()
        print(f"after scroll {step + 1}: {loaded} loaded blocks")

    browser.close()
