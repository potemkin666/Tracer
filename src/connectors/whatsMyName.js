import httpClient from '../httpClient.js';
import { normalise } from '../normaliser.js';

let cachedData = null;

async function fetchData() {
  if (cachedData) return cachedData;
  const response = await httpClient.get(
    'https://raw.githubusercontent.com/WebBreacher/WhatsMyName/main/wmn-data.json',
    { timeout: 10000 }
  );
  cachedData = response.data;
  return cachedData;
}

async function checkSite(site, username) {
  const checkUri = (site.check_uri || '').replace('{account}', username);
  if (!checkUri) return null;

  try {
    const res = await httpClient.get(checkUri, {
      timeout: 5000,
      maxRedirects: 3,
      validateStatus: () => true,
      responseType: 'text',
    });

    const accountExistsCode = site.account_existence_code;
    const accountExistsString = site.account_existence_string;

    if (res.status !== accountExistsCode) return null;

    if (accountExistsString && typeof res.data === 'string') {
      if (!res.data.includes(accountExistsString)) return null;
    }

    return checkUri;
  } catch (err) {
    console.error('[connectors/whatsMyName]', err.message);
    return null;
  }
}

async function search(query, apiKeys = {}) {
  try {
    const data = await fetchData();
    const sites = (data && data.sites) || [];

    const username = query.trim().toLowerCase().split(/\s+/)[0];
    const batch = sites.slice(0, 50);

    const checks = await Promise.allSettled(
      batch.map((site) => checkSite(site, username))
    );

    const results = [];
    for (let i = 0; i < checks.length; i++) {
      const outcome = checks[i];
      if (outcome.status === 'fulfilled' && outcome.value) {
        const site = batch[i];
        results.push(
          normalise('whats-my-name', query, {
            title: `[${site.name}] ${username}`,
            url: outcome.value,
            snippet: `Username "${username}" found on ${site.name} (category: ${site.category || 'unknown'})`,
            rank: results.length + 1,
            meta: { tags: ['social', 'username-check'] },
          })
        );
      }
    }

    return results;
  } catch (err) {
    console.error('[whats-my-name] search failed:', err.message);
    return [];
  }
}

export { search };
