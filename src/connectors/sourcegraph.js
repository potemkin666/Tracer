import axios from 'axios';
import { normalise } from '../normaliser.js';

const GQL_QUERY = `
query Search($q: String!) {
  search(query: $q, version: V3, patternType: literal) {
    results {
      results {
        ... on FileMatch {
          file { path url }
          repository { name url }
          lineMatches { preview }
        }
      }
    }
  }
}`;

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.post(
      'https://sourcegraph.com/.api/graphql',
      { query: GQL_QUERY, variables: { q: query } },
      { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
    );
    const results =
      (response.data.data &&
        response.data.data.search &&
        response.data.data.search.results &&
        response.data.data.search.results.results) || [];
    return results.map((r, i) => {
      const repoName = (r.repository && r.repository.name) || '';
      const filePath = (r.file && r.file.path) || '';
      const fileUrl = (r.file && r.file.url) || (r.repository && r.repository.url) || '';
      const snippet = (r.lineMatches || []).map((lm) => lm.preview).join(' ').slice(0, 200);
      return normalise('sourcegraph', query, {
        title: `${repoName}/${filePath}`,
        url: fileUrl ? `https://sourcegraph.com${fileUrl}` : '',
        snippet,
        rank: i + 1,
      });
    });
  } catch (err) { console.error('[connectors/sourcegraph]', err.message); return []; }
}

export { search };
