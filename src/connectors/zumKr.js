import httpClient from '../httpClient.js';
import cheerio from 'cheerio';
import { normalise } from '../normaliser.js';

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

async function search(query, apiKeys = {}) {
  try {
    const response = await httpClient.get('https://search.zum.com/search.zum', {
      params: { query },
      headers: {
        'User-Agent': UA,
        Accept: 'text/html',
        'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.5',
      },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('.result, .search-result, article').each((i, el) => {
      const titleEl = $(el).find('h3 a, h2 a, a').first();
      const title = titleEl.text().trim() || $(el).find('a').first().text().trim();
      let url = titleEl.attr('href') || $(el).find('a').first().attr('href') || '';
      if (url && !url.startsWith('http')) { url = 'https://search.zum.com' + url; }
      const snippet = $(el).find('p, .snippet').first().text().trim();
      if (title || url) { results.push(normalise('zum-kr', query, { title, url, snippet, rank: i + 1 })); }
    });
    return results;
  } catch (err) { console.error('[connectors/zum-kr]', err.message); return []; }
}

export { search };
