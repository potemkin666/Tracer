import httpClient from '../httpClient.js';
import { normalise } from '../normaliser.js';

async function search(query, apiKeys = {}) {
  try {
    if (!apiKeys.greynoise) return [];
    const response = await httpClient.get(
      `https://api.greynoise.io/v3/community/${encodeURIComponent(query)}`,
      {
        headers: { key: apiKeys.greynoise },
        timeout: 10000,
      }
    );
    const data = response.data;
    if (!data || !data.ip) return [];
    return [
      normalise('greynoise', query, {
        title: `${data.ip} (${data.classification || 'unknown'})`,
        url: `https://viz.greynoise.io/ip/${data.ip}`,
        snippet: `${data.name || ''} · ${data.noise ? 'Noise detected' : 'No noise'} · ${data.riot ? 'RIOT' : ''}`.trim(),
        rank: 1,
      }),
    ];
  } catch (err) { console.error('[connectors/greynoise]', err.message); return []; }
}

export { search };
