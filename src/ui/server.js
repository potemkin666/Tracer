const express = require('express');
const { run } = require('../orchestrator');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tracer</title>
  <style>
    body { font-family: sans-serif; max-width: 600px; margin: 4rem auto; padding: 1rem; }
    h1 { margin-bottom: 1.5rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 600; }
    input, select { width: 100%; padding: 0.5rem; margin-bottom: 1rem; border: 1px solid #ccc; border-radius: 4px; }
    button { padding: 0.6rem 1.5rem; background: #1a73e8; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
    button:hover { background: #1558b0; }
  </style>
</head>
<body>
  <h1>Tracer Search</h1>
  <form id="searchForm">
    <label for="input">Name / Username</label>
    <input type="text" id="input" name="input" placeholder="e.g. john smith" required>
    <label for="mode">Mode</label>
    <select id="mode" name="mode">
      <option value="normal">Normal</option>
      <option value="aggressive">Aggressive</option>
    </select>
    <button type="submit">Search</button>
  </form>
  <pre id="output" style="margin-top:2rem;white-space:pre-wrap;"></pre>
  <script>
    document.getElementById('searchForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = document.getElementById('input').value;
      const mode = document.getElementById('mode').value;
      document.getElementById('output').textContent = 'Searching...';
      const res = await fetch('/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, mode }),
      });
      const data = await res.json();
      document.getElementById('output').textContent = JSON.stringify(data, null, 2);
    });
  </script>
</body>
</html>`);
});

app.post('/search', async (req, res) => {
  const { input, mode, apiKeys, fossils, avatars, timeSliceMode, documents } = req.body || {};
  if (!input) return res.status(400).json({ error: 'input is required' });

  try {
    const { results, avatarClusters } = await run(input, {
      mode,
      apiKeys,
      fossils,
      avatars,
      timeSliceMode,
      documents,
    });
    res.json({ results, avatarClusters });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Tracer UI running at http://localhost:${PORT}`);
});

module.exports = app;
