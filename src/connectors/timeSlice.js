const axios = require('axios');
const { normalise } = require('../normaliser');

const ERAS = [
  { year: 2013, from: '20120101', to: '20141231' },
  { year: 2016, from: '20150101', to: '20171231' },
  { year: 2019, from: '20180101', to: '20201231' },
  { year: 2021, from: '20200101', to: '20221231' },
];

async function searchEra(query, era) {
  try {
    const response = await axios.get('https://web.archive.org/cdx/search/cdx', {
      params: {
        url: `*${query}*`,
        output: 'json',
        fl: 'original,timestamp,statuscode',
        filter: 'statuscode:200',
        from: era.from,
        to: era.to,
        limit: 5,
        collapse: 'urlkey',
      },
      timeout: 10000,
    });

    const rows = response.data;
    if (!Array.isArray(rows) || rows.length < 2) return [];

    const headers = rows[0];
    const originalIdx = headers.indexOf('original');
    const timestampIdx = headers.indexOf('timestamp');

    return rows.slice(1).map((row, i) => {
      const url = row[originalIdx] || '';
      const timestamp = row[timestampIdx] || '';
      return normalise('timeslice', query, {
        title: `[${era.year}] ${url}`,
        url: `https://web.archive.org/web/${timestamp}/${url}`,
        snippet: `Captured in ${era.year} era (${timestamp.slice(0, 8)}) — people were sloppier then`,
        rank: i + 1,
        meta: { era: era.year, tags: ['timeslice'] },
      });
    });
  } catch (err) { console.error('[connectors/timeSlice]', err.message); return []; }
}

/**
 * Search across one or more historical eras via the Wayback CDX API.
 * @param {string} query
 * @param {number[]} [years] - subset of [2013, 2016, 2019, 2021]; defaults to all
 */
async function search(query, years) {
  const targetEras =
    years && years.length ? ERAS.filter((e) => years.includes(e.year)) : ERAS;

  const batches = await Promise.all(targetEras.map((era) => searchEra(query, era)));
  return batches.flat();
}

module.exports = { search, ERAS };
