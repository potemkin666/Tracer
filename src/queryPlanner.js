export function buildQueryPlan(input) {
  const raw = input.trim();
  const lower = raw.toLowerCase();
  const tokens = lower.split(/\s+/).filter(Boolean);

  return {
    raw,
    lower,
    tokens,
    exact: tokens.length > 1 ? `"${raw}"` : raw,
    noSpaces: tokens.join(''),
    underscored: tokens.join('_'),
    hyphenated: tokens.join('-'),
  };
}

function uniqueQueries(queries) {
  const seen = new Set();
  return queries.filter((query) => {
    const key = query.toLowerCase();
    if (!query || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function generateQueries(input) {
  const plan = buildQueryPlan(input);

  return uniqueQueries([
    plan.exact,
    plan.raw,
    plan.noSpaces,
    plan.underscored,
    plan.hyphenated,
    `${plan.exact} site:linkedin.com`,
    `${plan.exact} site:twitter.com`,
    `${plan.exact} site:github.com`,
    `${plan.exact} site:reddit.com`,
    `${plan.exact} site:facebook.com`,
    `${plan.exact} site:web.archive.org`,
  ]);
}

const DOC_FILETYPES = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'];

export function generateDocQueries(input) {
  const quoted = `"${input}"`;
  return DOC_FILETYPES.map((ft) => `${quoted} filetype:${ft}`);
}
