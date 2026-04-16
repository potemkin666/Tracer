import httpClient from '../httpClient.js';
import cheerio from 'cheerio';
import { normalise } from '../normaliser.js';

async function search(query, apiKeys = {}) {
  try {
    const response = await httpClient.get('https://export.arxiv.org/api/query', {
      params: { search_query: `all:${query}`, max_results: 10, sortBy: 'relevance' },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data, { xmlMode: true });
    const items = [];
    $('entry').each((i, el) => {
      items.push({
        title: $(el).find('title').first().text().trim(),
        url: $(el).find('id').first().text().trim(),
        snippet: $(el).find('summary').first().text().trim(),
        rank: i + 1,
      });
    });
    return items.map(item => normalise('arxiv', query, item));
  } catch (err) { console.error('[connectors/arxiv]', err.message); return []; }
}

export { search };
