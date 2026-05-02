import fs from 'fs/promises';
import { ENGINE_METADATA } from '../src/engineMetadata.js';

const outputPath = new URL('../docs/engine-metadata.js', import.meta.url);
const content = `globalThis.TRACER_ENGINE_METADATA = ${JSON.stringify(ENGINE_METADATA, null, 2)};\n`;

await fs.writeFile(outputPath, content, 'utf8');
