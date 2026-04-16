const axios = require('axios');
const cheerio = require('cheerio');
const { normalise } = require('../normaliser');

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get('https://export.arxiv.org/api/query', {
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

module.exports = { search };
