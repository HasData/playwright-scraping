// collect-health.mjs — pull npm weekly downloads, latest version date,
// GitHub stars and last push for every library covered in the article.

const PACKAGES = [
  // Active / recommended
  'cheerio',
  'playwright',
  'puppeteer',
  'jsdom',
  'crawlee',
  'axios',
  'got',
  'playwright-extra',
  'puppeteer-extra-plugin-stealth',
  // Legacy / skip-list
  'x-ray',
  'nightmare',
  'osmosis',
  'node-fetch',
  'request',
  'superagent',
  'selenium-webdriver',
];

async function fetchJson(url, headers = {}) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json();
}

function parseRepoUrl(url) {
  if (!url) return null;
  const m = url.match(/github\.com[/:]([^/]+)\/([^/.#?]+)/i);
  if (!m) return null;
  return { owner: m[1], name: m[2].replace(/\.git$/, '') };
}

async function getPackage(name) {
  const meta = await fetchJson(`https://registry.npmjs.org/${name}`);
  const latest = meta['dist-tags']?.latest;
  const latestDate = meta.time?.[latest] || null;
  const repo = parseRepoUrl(meta.repository?.url || meta.homepage || '');

  let weekly = null;
  try {
    const dl = await fetchJson(`https://api.npmjs.org/downloads/point/last-week/${name}`);
    weekly = dl.downloads;
  } catch {}

  let stars = null;
  let pushedAt = null;
  if (repo) {
    try {
      const gh = await fetchJson(`https://api.github.com/repos/${repo.owner}/${repo.name}`);
      stars = gh.stargazers_count;
      pushedAt = gh.pushed_at;
    } catch (e) {
      // Rate limit or rename; leave nulls.
    }
  }

  return {
    name,
    latest,
    latestDate,
    weekly,
    repo: repo ? `${repo.owner}/${repo.name}` : null,
    stars,
    pushedAt,
  };
}

const rows = [];
for (const name of PACKAGES) {
  try {
    const r = await getPackage(name);
    rows.push(r);
    console.log(
      `${name.padEnd(34)} v${(r.latest || '?').padEnd(12)} ` +
      `${(r.weekly?.toLocaleString() ?? '?').padStart(12)} dl/wk  ` +
      `${(r.stars?.toLocaleString() ?? '?').padStart(8)} stars  ` +
      `last push ${r.pushedAt?.slice(0, 10) || '?'}  ` +
      `release ${r.latestDate?.slice(0, 10) || '?'}`,
    );
  } catch (e) {
    console.log(`${name}: ERROR ${e.message}`);
  }
}

console.log('\n--- Machine-readable ---');
console.log(JSON.stringify(rows, null, 2));
