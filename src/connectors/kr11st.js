import httpClient from '../httpClient.js';
import cheerio from 'cheerio';
import { normalise } from '../normaliser.js';

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

async function search(query, apiKeys = {}) {
  try {
    const response = await httpClient.get('https://search.11st.co.kr/Search.tmall', {
      params: { kwd: query },
      headers: {
        'User-Agent': UA,
        Accept: 'text/html',
        'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.5',
      },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('.result, .search-result, .product, article').each((i, el) => {
      const titleEl = $(el).find('h3 a, h2 a, a').first();
      const title = titleEl.text().trim() || $(el).find('a').first().text().trim();
      let url = titleEl.attr('href') || $(el).find('a').first().attr('href') || '';
      if (url && !url.startsWith('http')) { url = 'https://www.11st.co.kr' + url; }
      const snippet = $(el).find('p, .info, .price').first().text().trim();
      if (title || url) { results.push(normalise('11st-kr', query, { title, url, snippet, rank: i + 1 })); }
    });
    return results;
  } catch (err) { console.error('[connectors/11st-kr]', err.message); return []; }
}

export { search };
