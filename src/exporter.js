import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Handlebars from 'handlebars';
import { buildGraph } from './graphBuilder.js';
import { buildResultsBrief } from '../docs/scripts/shared/resultBrief.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Handlebars helpers ─────────────────────────────────────────────────────
Handlebars.registerHelper('scoreColor', (score) => {
  if (score >= 70) return '#27ae60';
  if (score >= 40) return '#f39c12';
  return '#e74c3c';
});

Handlebars.registerHelper('joinTags', (tags) => {
  return Array.isArray(tags) ? tags.join(', ') : '';
});

export function exportJSON(results, filepath) {
  fs.writeFileSync(filepath, JSON.stringify(results, null, 2), 'utf8');
}

export function exportHTML(results, filepath, avatarClusters = []) {
  const templatePath = path.join(__dirname, '..', 'templates', 'report.html');
  const templateSource = fs.readFileSync(templatePath, 'utf8');
  const template = Handlebars.compile(templateSource);

  const graph = buildGraph(results, avatarClusters);
  const html = template({
    brief: buildResultsBrief(results),
    results,
    graphJSON: JSON.stringify(graph),
  });
  fs.writeFileSync(filepath, html, 'utf8');
}
