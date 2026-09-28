from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("https://the-internet.herokuapp.com/add_remove_elements/")

    # Each click adds a Delete button to the page
    page.click("button[onclick='addElement()']")
    page.click("button[onclick='addElement()']")
    added = page.locator("#elements button").count()
    print(f"buttons after two clicks: {added}")
    browser.close()
