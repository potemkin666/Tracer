import axios from 'axios';
import cheerio from 'cheerio';
import { normalise } from '../normaliser.js';

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get(
      `https://boardreader.com/s/${encodeURIComponent(query)}.html`,
      {
        headers: { 'User-Agent': UA, Accept: 'text/html' },
        timeout: 10000,
      }
    );
    const $ = cheerio.load(response.data);
    const results = [];
    $('.post-title a').each((i, el) => {
      const title = $(el).text().trim();
      const url = $(el).attr('href') || '';
      const snippet = $(el).closest('li, .post').find('.post-text').text().trim();
      if (title || url) results.push(normalise('boardreader', query, { title, url, snippet, rank: i + 1 }));
    });
    return results;
  } catch (err) { console.error('[connectors/boardreader]', err.message); return []; }
}

export { search };
