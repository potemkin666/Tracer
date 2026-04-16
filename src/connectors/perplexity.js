import axios from 'axios';
import { normalise } from '../normaliser.js';

const URL_RE = /https?:\/\/[^\s"'<>)\]]+/g;

async function search(query, apiKeys = {}) {
  const apiKey = apiKeys.perplexity;
  if (!apiKey) return [];
  try {
    const response = await axios.post('https://api.perplexity.ai/chat/completions', {
      model: 'sonar',
      messages: [{ role: 'user', content: `Find publicly available information about this person or topic: "${query}". List the top 5 most relevant URLs with brief descriptions of what each page contains.` }],
      max_tokens: 800,
    }, {
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      timeout: 20000,
    });
    const content = (response.data.choices[0] && response.data.choices[0].message && response.data.choices[0].message.content) || '';
    const urls = [...new Set(content.match(URL_RE) || [])].slice(0, 10);
    const lines = content.split('\n').filter(Boolean);
    return urls.map((url, i) => {
      const line = lines.find(l => l.includes(url)) || '';
      const snippet = line.replace(url, '').replace(/^[\s\-.*]+/, '').trim().slice(0, 200);
      return normalise('perplexity', query, { title: url, url, snippet, rank: i + 1 });
    });
  } catch (err) { console.error('[connectors/perplexity]', err.message); return []; }
}
export { search };
