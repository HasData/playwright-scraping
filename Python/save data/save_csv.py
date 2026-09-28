# Save h2 headers to CSV file

from playwright.sync_api import sync_playwright
import csv

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("https://quotes.toscrape.com")
    headers = page.locator(".quote .text").all_inner_texts()
    with open("headers.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["Header"])
        for h in headers:
            writer.writerow([h])
    browser.close()