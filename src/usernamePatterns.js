/**
 * Shared URL-to-username extraction patterns.
 *
 * Used by both enricher.js (platform classification) and graphBuilder.js
 * (shared-username edge detection) so the regexes are defined once.
 *
 * Each entry: first capture group is the username.
 */
export const USERNAME_PATTERNS = [
  /(?:twitter|x)\.com\/([A-Za-z0-9_]{1,40})\/?$/i,
  /github\.com\/([A-Za-z0-9_-]{1,40})\/?$/i,
  /gitlab\.com\/([A-Za-z0-9_.-]{1,40})\/?$/i,
  /instagram\.com\/([A-Za-z0-9_.]{1,40})\/?$/i,
  /linkedin\.com\/in\/([A-Za-z0-9_-]{1,80})\/?$/i,
  /reddit\.com\/user\/([A-Za-z0-9_-]{1,40})\/?$/i,
  /facebook\.com\/([A-Za-z0-9.]{1,80})\/?$/i,
  /tiktok\.com\/@([A-Za-z0-9_.]{1,40})/i,
  /medium\.com\/@([A-Za-z0-9_-]{1,60})/i,
  /bitbucket\.org\/([A-Za-z0-9_-]{1,40})\/?$/i,
  /codepen\.io\/([A-Za-z0-9_-]{1,40})\/?$/i,
  /dev\.to\/([A-Za-z0-9_-]{1,40})\/?$/i,
  /keybase\.io\/([A-Za-z0-9_]{1,40})\/?$/i,
  /pinterest\.com\/([A-Za-z0-9_]{1,40})\/?$/i,
  /tumblr\.com\/([A-Za-z0-9_-]{1,40})\/?$/i,
];
