function generateQueries(input) {
  const quoted = `"${input}"`;
  const noSpaces = input.replace(/\s+/g, '');
  const underscored = input.replace(/\s+/g, '_');

  return [
    quoted,
    `${quoted} site:linkedin.com`,
    `${quoted} site:twitter.com`,
    `${quoted} site:github.com`,
    `${quoted} site:reddit.com`,
    `${quoted} site:facebook.com`,
    `${quoted} site:web.archive.org`,
    `cache:${quoted}`,
    noSpaces,
    underscored,
    input,
  ];
}

module.exports = { generateQueries };
