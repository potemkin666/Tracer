import axios from 'axios';
import cheerio from 'cheerio';
import { normalise } from '../normaliser.js';

async function search(query) {
  try {
    const response = await axios.get('https://papers.ssrn.com/sol3/results.cfm', {
      params: { txtkey: query, start: 1 },
      headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36', Accept: 'text/html' },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('.title a, .gs_rt a, .paper-title a').each((i, el) => {
      const title = $(el).text().trim();
      const href = $(el).attr('href') || '';
      const url = href.startsWith('http') ? href : 'https://papers.ssrn.com' + href;
      if (title) results.push(normalise('ssrn', query, { title, url, snippet: '', rank: i + 1 }));
    });
    return results.slice(0, 10);
  } catch (err) { console.error('[connectors/ssrn]', err.message); return []; }
}
export { search };
