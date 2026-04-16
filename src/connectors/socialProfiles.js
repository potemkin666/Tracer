const axios = require('axios');
const { normalise } = require('../normaliser');
const { PLATFORMS } = require('./platforms');

// ── Concurrency limiter (no external deps) ──────────────────────────────────
const MAX_CONCURRENCY = 10;

function pLimit(concurrency) {
  let active = 0;
  const queue = [];

  function next() {
    if (queue.length === 0 || active >= concurrency) return;
    active++;
    const { fn, resolve, reject } = queue.shift();
    fn().then(resolve, reject).finally(() => { active--; next(); });
  }

  return function limit(fn) {
    return new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      next();
    });
  };
}

// ── Profile checking ────────────────────────────────────────────────────────

async function checkUrl(url, username) {
  try {
    const res = await axios.get(url, {
      timeout: 5000,
      maxRedirects: 0,
      validateStatus: () => true,
      headers: { 'User-Agent': 'Tracer/1.0' },
    });
    // Content-based validation: 200 + username present in body.
    return (
      res.status === 200 &&
      typeof res.data === 'string' &&
      res.data.toLowerCase().includes(username.toLowerCase())
    );
  } catch (err) {
    console.error('[connectors/socialProfiles]', err.message);
    return false;
  }
}

async function checkHackerNews(u) {
  try {
    const res = await axios.get(`https://hacker-news.firebaseio.com/v0/user/${u}.json`, { timeout: 5000 });
    return res.data && res.data.created ? { found: true, url: `https://news.ycombinator.com/user?id=${u}` } : { found: false };
  } catch (err) {
    console.error('[connectors/socialProfiles]', err.message);
    return { found: false };
  }
}

async function checkStackOverflow(u) {
  try {
    const res = await axios.get('https://api.stackexchange.com/2.3/users', {
      params: { site: 'stackoverflow', filter: '!9Z(-wwYGT', inname: u, pagesize: 5 },
      timeout: 5000,
    });
    const items = (res.data && res.data.items) || [];
    if (items.length > 0) {
      return { found: true, url: items[0].link };
    }
    return { found: false };
  } catch (err) {
    console.error('[connectors/socialProfiles]', err.message);
    return { found: false };
  }
}

async function search(query, apiKeys = {}) {
  try {
    const parts = query.trim().toLowerCase().split(/\s+/);
    const u1 = parts[0];
    const u2 = parts.join('');
    const usernames = u1 === u2 ? [u1] : [u1, u2];

    const results = [];
    const seen = new Set();
    const limit = pLimit(MAX_CONCURRENCY);

    const checks = [];

    for (const u of usernames) {
      for (const platform of PLATFORMS) {
        const url = platform.url(u);
        checks.push(
          limit(() => checkUrl(url, u).then(found => {
            if (found && !seen.has(platform.id + u)) {
              seen.add(platform.id + u);
              results.push({ platform: platform.id, url, u });
            }
          }))
        );
      }

      checks.push(
        limit(() => checkHackerNews(u).then(r => {
          if (r.found && !seen.has('HackerNews' + u)) {
            seen.add('HackerNews' + u);
            results.push({ platform: 'Hacker News', url: r.url, u });
          }
        }))
      );

      checks.push(
        limit(() => checkStackOverflow(u).then(r => {
          if (r.found && !seen.has('StackOverflow' + u)) {
            seen.add('StackOverflow' + u);
            results.push({ platform: 'Stack Overflow', url: r.url, u });
          }
        }))
      );
    }

    await Promise.allSettled(checks);

    return results.map((r, i) =>
      normalise('social-profiles', query, {
        title: `[${r.platform}] ${r.url}`,
        url: r.url,
        snippet: `${r.platform} profile found for username: ${r.u}`,
        rank: i + 1,
        meta: { tags: ['social', 'profile'] },
      })
    );
  } catch (err) { console.error('[connectors/socialProfiles]', err.message); return []; }
}

module.exports = { search };
