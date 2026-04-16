import httpClient from '../httpClient.js';
import { normalise } from '../normaliser.js';

async function search(query, apiKeys = {}) {
  try {
    const response = await httpClient.get(
      'https://api.base-search.net/cgi-bin/BaseHttpSearchInterface.fcgi',
      {
        params: { func: 'PerformSearch', query, hits: 10, offset: 0, format: 'json' },
        timeout: 10000,
      }
    );
    const docs = (response.data.response && response.data.response.docs) || [];
    return docs.map((doc, i) =>
      normalise('base', query, {
        title: doc.dctitle,
        url: doc.dcidentifier,
        snippet: doc.dcdescription,
        rank: i + 1,
      })
    );
  } catch (err) { console.error('[connectors/base]', err.message); return []; }
}

export { search };
