const axios = require('axios');
const { normalise } = require('../normaliser');

async function search(query, apiKeys = {}) {
  try {
    const searchResp = await axios.post(
      'https://2.intelx.io/intelligent/search',
      {
        term: query,
        buckets: [],
        lookuplevel: 0,
        maxresults: 10,
        timeout: 0,
        datefrom: '',
        dateto: '',
        sort: 4,
        media: 0,
        terminate: [],
      },
      {
        headers: { 'x-key': apiKeys.intelx },
        timeout: 10000,
      }
    );
    const id = searchResp.data && searchResp.data.id;
    if (!id) return [];

    const resultResp = await axios.get('https://2.intelx.io/intelligent/search/result', {
      params: { id, limit: 10, apikey: apiKeys.intelx },
      headers: { 'x-key': apiKeys.intelx },
      timeout: 10000,
    });
    const records = (resultResp.data && resultResp.data.records) || [];
    return records.map((record, i) =>
      normalise('intelx', query, {
        title: record.name || record.storageid,
        url: `https://intelx.io/?did=${record.storageid}`,
        snippet: `Media: ${record.media} | Added: ${record.added || ''}`,
        rank: i + 1,
      })
    );
  } catch {
    return [];
  }
}

module.exports = { search };
