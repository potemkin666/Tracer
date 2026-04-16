const path = require('path');
const express = require('express');
const { run } = require('../orchestrator');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

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
