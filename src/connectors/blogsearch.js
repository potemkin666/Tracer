import httpClient from '../httpClient.js';
import cheerio from 'cheerio';
import { normalise } from '../normaliser.js';

async function search(query) {
  try {
    const response = await httpClient.get('https://www.blog-search.com/search.php', {
      params: { q: query, lang: 'en' },
      headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36', Accept: 'text/html' },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('.result, .blog-result, .search-result').each((i, el) => {
      const title = $(el).find('h2 a, h3 a, .title').first().text().trim();
      const url = $(el).find('h2 a, h3 a').first().attr('href') || '';
      const snippet = $(el).find('.description, .snippet, p').first().text().trim();
      if (title || url) results.push(normalise('blog-search', query, { title, url, snippet, rank: i + 1 }));
    });
    return results;
  } catch (err) { console.error('[connectors/blogsearch]', err.message); return []; }
}
export { search };
