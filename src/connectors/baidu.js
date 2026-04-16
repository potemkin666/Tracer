const axios = require('axios');
const cheerio = require('cheerio');
const { normalise } = require('../normaliser');

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get('https://www.baidu.com/s', {
      params: { wd: query, rn: 10 },
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Accept: 'text/html',
        'Accept-Language': 'zh-CN,zh;q=0.9',
      },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('.result').each((i, el) => {
      const linkEl = $(el).find('h3 a');
      const title = linkEl.text().trim();
      const url = linkEl.attr('href') || '';
      const snippet = $(el).find('.c-abstract').text().trim();
      if (title || url) results.push(normalise('baidu', query, { title, url, snippet, rank: i + 1 }));
    });
    return results;
  } catch {
    return [];
  }
}

module.exports = { search };
