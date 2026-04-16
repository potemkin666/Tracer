const axios = require('axios');
const { normalise } = require('../normaliser');

async function search(query) {
  try {
    const response = await axios.get('https://api.europeana.eu/record/v2/search.json', {
      params: { query, rows: 10, profile: 'standard' },
      timeout: 10000,
    });
    const items = response.data.items || [];
    return items.map((item, i) =>
      normalise('europeana', query, {
        title: (Array.isArray(item.title) ? item.title[0] : item.title) || '',
        url: item.guid || item.link || '',
        snippet: (Array.isArray(item.dcDescription) ? item.dcDescription[0] : item.dcDescription) || (Array.isArray(item.dcCreator) ? 'Creator: ' + item.dcCreator[0] : ''),
        rank: i + 1,
      })
    );
  } catch { return []; }
}
module.exports = { search };
