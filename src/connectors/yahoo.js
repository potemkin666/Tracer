import axios from 'axios';
import cheerio from 'cheerio';
import { normalise } from '../normaliser.js';

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

function decodeYahooUrl(href) {
  try {
    const match = href.match(/RU=([^/]+)/);
    if (match) return decodeURIComponent(match[1]);
  } catch (err) { console.error('[connectors/yahoo]', err.message); }
  return href;
}

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get('https://search.yahoo.com/search', {
      params: { p: query, n: 10 },
      headers: { 'User-Agent': UA },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('#web ol li').each((i, el) => {
      const titleEl = $(el).find('.title a, h3 a').first();
      const title = titleEl.text().trim();
      const rawHref = titleEl.attr('href') || '';
      const url = decodeYahooUrl(rawHref);
      const snippet = $(el).find('.abstr, .compText').first().text().trim();
      if (title || url) results.push(normalise('yahoo', query, { title, url, snippet, rank: i + 1 }));
    });
    return results;
  } catch (err) { console.error('[connectors/yahoo]', err.message); return []; }
}

export { search };
