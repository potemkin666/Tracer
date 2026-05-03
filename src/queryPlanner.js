export {
  buildQueryPlan,
  detectQueryIntent,
  generateQueries,
  isFuzzyHandleMatch,
  parseOperators,
  rewriteQueryTerms,
  uniqueCaseInsensitive,
} from '../docs/scripts/shared/queryShared.js';

const DOC_FILETYPES = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'];

export function generateDocQueries(input) {
  const quoted = `"${input}"`;
  return DOC_FILETYPES.map((ft) => `${quoted} filetype:${ft}`);
}
