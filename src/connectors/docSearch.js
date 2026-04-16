const axios = require('axios');
const { normalise } = require('../normaliser');
const { generateDocQueries } = require('../queryPlanner');

// Wayback CDX mimetype prefixes for each document family.
const DOC_MIMETYPES = [
  { mime: 'application/pdf', ext: 'pdf' },
  { mime: 'application/msword', ext: 'doc' },
  { mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml', ext: 'docx' },
  { mime: 'application/vnd.ms-powerpoint', ext: 'ppt' },
  { mime: 'application/vnd.openxmlformats-officedocument.presentationml', ext: 'pptx' },
  { mime: 'application/vnd.ms-excel', ext: 'xls' },
];

function extFromMime(mime) {
  if (mime.includes('pdf')) return 'pdf';
  if (mime.includes('presentationml') || mime.includes('powerpoint')) return 'ppt';
  if (mime.includes('spreadsheetml') || mime.includes('ms-excel')) return 'xls';
  if (mime.includes('wordprocessingml') || mime.includes('msword')) return 'doc';
  return 'doc';
}

function extFromQuery(query) {
  const m = query.match(/filetype:(\w+)/i);
  return m ? m[1] : 'doc';
}

async function searchWaybackDocs(input) {
  const results = [];

  await Promise.all(
    DOC_MIMETYPES.map(async ({ mime, ext }) => {
      try {
        const response = await axios.get('https://web.archive.org/cdx/search/cdx', {
          params: {
            url: `*${input.replace(/\s+/g, '*')}*`,
            output: 'json',
            fl: 'original,timestamp,statuscode,mimetype',
            filter: `mimetype:${mime}`,
            limit: 5,
            collapse: 'urlkey',
          },
          timeout: 10000,
        });

        const rows = response.data;
        if (!Array.isArray(rows) || rows.length < 2) return;

        const headers = rows[0];
        const originalIdx = headers.indexOf('original');
        const timestampIdx = headers.indexOf('timestamp');
        const mimeIdx = headers.indexOf('mimetype');

        rows.slice(1).forEach((row, i) => {
          const url = row[originalIdx] || '';
          const timestamp = row[timestampIdx] || '';
          const detectedMime = row[mimeIdx] || mime;
          const fileExt = extFromMime(detectedMime) || ext;
          const filename = url.split('/').pop() || url;
          results.push(
            normalise('wayback-docs', input, {
              title: `[${fileExt.toUpperCase()}] ${filename}`,
              url: `https://web.archive.org/web/${timestamp}/${url}`,
              snippet: `${fileExt.toUpperCase()} document archived ${timestamp.slice(0, 8)} — names survive in attachments`,
              rank: i + 1,
              meta: { fileType: fileExt, tags: ['document'] },
            })
          );
        });
      } catch (err) {
        console.error('[connectors/docSearch]', err.message);
      }
    })
  );

  return results;
}

async function searchWithFiletype(input, apiKeys) {
  if (!apiKeys.brave && !apiKeys.serpapi) return [];

  const brave = apiKeys.brave ? require('./brave') : null;
  const serpapi = apiKeys.serpapi ? require('./serpapi') : null;

  const docQueries = generateDocQueries(input);
  const results = [];

  await Promise.all(
    docQueries.map(async (dq) => {
      const fetches = [];
      if (brave) fetches.push(brave.search(dq, apiKeys));
      if (serpapi) fetches.push(serpapi.search(dq, apiKeys));

      const batches = await Promise.all(fetches);
      const fileType = extFromQuery(dq);
      batches.flat().forEach((item) => {
        results.push({
          ...item,
          source: item.source + '-docs',
          meta: { fileType, tags: ['document'] },
        });
      });
    })
  );

  return results;
}

/**
 * Search for documents (PDFs, DOCs, PPTs, XLS) that mention the input.
 * Uses Wayback CDX mimetype filtering plus optional filetype: operators
 * against Brave/SerpAPI if keys are supplied.
 */
async function search(input, apiKeys = {}) {
  const [waybackDocs, apiDocs] = await Promise.all([
    searchWaybackDocs(input),
    searchWithFiletype(input, apiKeys),
  ]);
  return [...waybackDocs, ...apiDocs];
}

module.exports = { search };
