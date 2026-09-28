from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("https://the-internet.herokuapp.com/dropdown")

    # Select by value attribute
    page.select_option("select#dropdown", "1")
    chosen = page.locator("select#dropdown option[selected]").inner_text()
    print("selected:", chosen)
    browser.close()
