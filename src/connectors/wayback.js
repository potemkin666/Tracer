const axios = require('axios');
const { normalise } = require('../normaliser');

async function search(query) {
  try {
    const response = await axios.get('https://web.archive.org/cdx/search/cdx', {
      params: {
        url: `*${query}*`,
        output: 'json',
        fl: 'original,timestamp,statuscode',
        filter: 'statuscode:200',
        limit: 10,
      },
    });

    const rows = response.data;
    if (!Array.isArray(rows) || rows.length < 2) return [];

    const headers = rows[0];
    const originalIdx = headers.indexOf('original');
    const timestampIdx = headers.indexOf('timestamp');

    return rows.slice(1).map((row, i) => {
      const url = row[originalIdx] || '';
      const timestamp = row[timestampIdx] || '';
      return normalise('wayback', query, {
        title: `Archived: ${url}`,
        url: `https://web.archive.org/web/${timestamp}/${url}`,
        snippet: `Captured at ${timestamp}`,
        rank: i + 1,
      });
    });
  } catch {
    return [];
  }
}

module.exports = { search };
