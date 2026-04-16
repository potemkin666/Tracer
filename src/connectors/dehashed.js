import httpClient from '../httpClient.js';
import { normalise } from '../normaliser.js';

async function search(query, apiKeys = {}) {
  try {
    if (!apiKeys.dehashed || !apiKeys.dehashed.includes(':')) return [];
    const [email, apikey] = apiKeys.dehashed.split(':');
    const response = await httpClient.get('https://api.dehashed.com/search', {
      params: { query, size: 10 },
      auth: { username: email, password: apikey },
      headers: { Accept: 'application/json' },
      timeout: 10000,
    });
    const entries = (response.data && response.data.entries) || [];
    return entries.map((entry, i) =>
      normalise('dehashed', query, {
        title: entry.email || entry.username || entry.name || '',
        url: `https://dehashed.com/search?query=${encodeURIComponent(query)}`,
        snippet: [entry.database_name, entry.ip_address, entry.hashed_password]
          .filter(Boolean)
          .join(' · '),
        rank: i + 1,
      })
    );
  } catch (err) { console.error('[connectors/dehashed]', err.message); return []; }
}

export { search };
