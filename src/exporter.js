import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Handlebars from 'handlebars';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function exportJSON(results, filepath) {
  fs.writeFileSync(filepath, JSON.stringify(results, null, 2), 'utf8');
}

export function exportHTML(results, filepath) {
  const templatePath = path.join(__dirname, '..', 'templates', 'report.html');
  const templateSource = fs.readFileSync(templatePath, 'utf8');
  const template = Handlebars.compile(templateSource);
  const html = template({ results });
  fs.writeFileSync(filepath, html, 'utf8');
}
