import httpClient from '../httpClient.js';
import { normalise } from '../normaliser.js';

async function search(query, apiKeys = {}) {
  try {
    if (!apiKeys.hibp) return [];
    const response = await httpClient.get(
      `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(query)}`,
      {
        params: { truncateResponse: false },
        headers: {
          'hibp-api-key': apiKeys.hibp,
          'User-Agent': 'Tracer-OSINT',
        },
        timeout: 10000,
      }
    );
    const breaches = response.data || [];
    return breaches.map((breach, i) =>
      normalise('haveibeenpwned', query, {
        title: breach.Name,
        url: `https://haveibeenpwned.com/account/${encodeURIComponent(query)}`,
        snippet: `Breached: ${breach.BreachDate} · ${(Array.isArray(breach.DataClasses) ? breach.DataClasses : []).slice(0, 3).join(', ')}`,
        rank: i + 1,
      })
    );
  } catch (err) {
    if (err.response && err.response.status === 404) return [];
    console.error('[connectors/haveibeenpwned]', err.message);
    return [];
  }
}

export { search };
