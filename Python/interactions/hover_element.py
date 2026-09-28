from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("https://the-internet.herokuapp.com/hovers")

    # The caption is display:none until its figure is hovered
    page.hover(".figure:nth-of-type(1)")
    caption = page.text_content(".figure:nth-of-type(1) .figcaption h5")
    print("revealed:", caption)
    browser.close()
