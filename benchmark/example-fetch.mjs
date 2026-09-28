// example-fetch.mjs — verify the fetch example in the article works.

const res = await fetch('https://books.toscrape.com', {
  headers: {
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36',
    'accept-language': 'en-US,en;q=0.9',
  },
});

if (!res.ok) throw new Error(`status ${res.status}`);
const html = await res.text();

console.log(`status: ${res.status}`);
console.log(`bytes: ${html.length}`);
console.log(`first 200 chars:\n${html.slice(0, 200)}`);
