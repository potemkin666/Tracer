const axios = require('axios');
const cheerio = require('cheerio');
const { normalise } = require('../normaliser');

async function search(query, apiKeys = {}) {
  try {
    const [user, key] = (apiKeys.yandex || ':').split(':');
    const response = await axios.get('https://yandex.com/search/xml', {
      params: {
        user,
        key,
        query,
        l10n: 'en',
        sortby: 'rlv',
        filter: 'none',
        'groupby': 'attr="".mode=flat.groups-on-page=10.docs-in-group=1',
      },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data, { xmlMode: true });
    const results = [];
    $('doc').each((i, el) => {
      const url = $(el).find('url').first().text().trim();
      const title = $(el).find('title').first().text().trim();
      const snippet = $(el).find('headline').first().text().trim();
      if (url) results.push(normalise('yandex', query, { title, url, snippet, rank: i + 1 }));
    });
    return results;
  } catch {
    return [];
  }
}

module.exports = { search };
