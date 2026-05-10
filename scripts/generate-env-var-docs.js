#!/usr/bin/env node
/**
 * Generate environment variable documentation table for README.md
 * 
 * Usage: node scripts/generate-env-var-docs.js
 * 
 * This reads KEY_DEFS from src/config.js and outputs a markdown table
 * that can be copied into README.md to keep documentation in sync.
 */

import { generateEnvVarMarkdownTable } from '../src/config.js';

console.log('Copy the following table into README.md:\n');
console.log(generateEnvVarMarkdownTable());
console.log('\nDone! Remember to update README.md with the generated table.');
