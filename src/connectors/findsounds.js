import axios from 'axios';
import cheerio from 'cheerio';
import { normalise } from '../normaliser.js';

async function search(query) {
  try {
    const response = await axios.get('https://www.findsounds.com/ISAPI/search.dll', {
      params: { query, start: 1 },
      headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36', Accept: 'text/html' },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('table td').filter((i, el) => $(el).find('a[href*=".wav"], a[href*=".mp3"], a[href*=".aif"]').length > 0).each((i, el) => {
      const a = $(el).find('a').first();
      const url = a.attr('href') || '';
      const title = a.text().trim() || url.split('/').pop();
      const snippet = $(el).text().replace(title, '').trim().slice(0, 150);
      if (url) results.push(normalise('findsounds', query, { title, url, snippet, rank: i + 1 }));
    });
    return results.slice(0, 10);
  } catch (err) { console.error('[connectors/findsounds]', err.message); return []; }
}
export { search };
