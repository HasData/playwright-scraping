// example-jsdom.mjs — verify the jsdom example in the article works.
// Demonstrates running inline page JS to deobfuscate an email.

import { JSDOM } from 'jsdom';

const html = `<!doctype html>
<div id="email"></div>
<script>
  document.getElementById('email').textContent =
    atob('aGVsbG9AZXhhbXBsZS5jb20=');
</script>`;

const dom = new JSDOM(html, { runScripts: 'dangerously' });
console.log(dom.window.document.getElementById('email').textContent);
