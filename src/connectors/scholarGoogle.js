import httpClient from '../httpClient.js';
import cheerio from 'cheerio';
import { normalise } from '../normaliser.js';

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

async function search(query, apiKeys = {}) {
  try {
    const response = await httpClient.get('https://scholar.google.com/scholar', {
      params: { q: query, hl: 'en', as_sdt: '0,5' },
      headers: { 'User-Agent': UA, Accept: 'text/html' },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('.gs_ri').each((i, el) => {
      const linkEl = $(el).find('.gs_rt a');
      const title = linkEl.text().trim();
      const url = linkEl.attr('href') || '';
      const snippet = $(el).find('.gs_rs').text().trim();
      if (title || url) results.push(normalise('scholar-google', query, { title, url, snippet, rank: i + 1 }));
    });
    return results;
  } catch (err) { console.error('[connectors/scholarGoogle]', err.message); return []; }
}

export { search };
