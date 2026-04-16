import httpClient from '../httpClient.js';
import cheerio from 'cheerio';
import { normalise } from '../normaliser.js';

async function search(query) {
  try {
    const response = await httpClient.get('https://opensearch.krugle.org/document/search/', {
      params: { query, page_size: 10, page_index: 1 },
      headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'text/html,application/json' },
      timeout: 10000,
    });
    if (typeof response.data === 'object' && response.data.documents) {
      return response.data.documents.slice(0, 10).map((doc, i) =>
        normalise('krugle', query, { title: doc.filename || doc.path || '', url: doc.url || '', snippet: doc.description || '', rank: i + 1 })
      );
    }
    const $ = cheerio.load(response.data);
    const results = [];
    $('.result, .document-result').each((i, el) => {
      const title = $(el).find('a').first().text().trim();
      const url = $(el).find('a').first().attr('href') || '';
      const snippet = $(el).find('p, .description').first().text().trim();
      if (title || url) results.push(normalise('krugle', query, { title, url, snippet, rank: i + 1 }));
    });
    return results;
  } catch (err) { console.error('[connectors/krugle]', err.message); return []; }
}
export { search };
