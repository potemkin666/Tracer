const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

function exportJSON(results, filepath) {
  fs.writeFileSync(filepath, JSON.stringify(results, null, 2), 'utf8');
}

function exportHTML(results, filepath) {
  const templatePath = path.join(__dirname, '..', 'templates', 'report.html');
  const templateSource = fs.readFileSync(templatePath, 'utf8');
  const template = Handlebars.compile(templateSource);
  const html = template({ results });
  fs.writeFileSync(filepath, html, 'utf8');
}

module.exports = { exportJSON, exportHTML };
