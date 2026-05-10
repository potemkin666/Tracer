import httpClient from '../httpClient.js';
import { normalise } from '../normaliser.js';
import { DEFAULT_TIMEOUT, logConnectorError } from './connectorUtils.js';

async function search(query, apiKeys = {}) {
  try {
    const apiKey = apiKeys.brave;
    const response = await httpClient.get('https://api.search.brave.com/res/v1/web/search', {
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': apiKey,
      },
      params: { q: query, count: 10 },
      timeout: DEFAULT_TIMEOUT,
    });

    const items = (response.data.web && response.data.web.results) || [];
    return items.map((item, i) =>
      normalise('brave', query, {
        title: item.title,
        url: item.url,
        snippet: item.description,
        rank: i + 1,
      })
    );
  } catch (err) { logConnectorError('brave', err); return []; }
}

export { search };
