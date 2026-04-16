import httpClient from '../httpClient.js';
import { normalise } from '../normaliser.js';

async function search(query, apiKeys = {}) {
  try {
    const response = await httpClient.get('https://grep.app/api/search', {
      params: { q: query, page: 1 },
      timeout: 10000,
    });
    const hits = (response.data.hits && response.data.hits.hits) || [];
    return hits.map((hit, i) => {
      const src = hit._source || {};
      const repoName = (src.repo && src.repo.name) || '';
      const repoUrl = (src.repo && src.repo.url) || '';
      const filePath = (src.file && src.file.path) || '';
      const url = repoUrl ? `${repoUrl}/blob/HEAD/${filePath}` : repoUrl;
      return normalise('grep.app', query, {
        title: `${repoName}/${filePath}`,
        url,
        snippet: src.content || '',
        rank: i + 1,
      });
    });
  } catch (err) { console.error('[connectors/grepdotapp]', err.message); return []; }
}

export { search };
