import { KEY_DEFS, ENV_KEY_MAP, generateEnvVarHelp, generateEnvVarMarkdownTable } from '../src/config.js';
import { KEY_DEFS as ENGINE_KEY_DEFS } from '../src/engineMetadata.js';

describe('config consistency', () => {
  test('KEY_DEFS and ENV_KEY_MAP are consistent', () => {
    const envVarsFromKeyDefs = KEY_DEFS.map(def => def.envVar).sort();
    const envVarsFromMap = Object.keys(ENV_KEY_MAP).sort();
    
    expect(envVarsFromKeyDefs).toEqual(envVarsFromMap);
    
    // Check that each env var maps to the correct id
    for (const def of KEY_DEFS) {
      expect(ENV_KEY_MAP[def.envVar]).toBe(def.id);
    }
  });

  test('engineMetadata.js KEY_DEFS matches config.js KEY_DEFS', () => {
    expect(ENGINE_KEY_DEFS).toEqual(KEY_DEFS);
  });

  test('all KEY_DEFS have required fields', () => {
    for (const def of KEY_DEFS) {
      expect(def).toHaveProperty('id');
      expect(def).toHaveProperty('envVar');
      expect(def).toHaveProperty('label');
      expect(def).toHaveProperty('description');
      
      expect(typeof def.id).toBe('string');
      expect(typeof def.envVar).toBe('string');
      expect(typeof def.label).toBe('string');
      expect(typeof def.description).toBe('string');
      
      expect(def.id.length).toBeGreaterThan(0);
      expect(def.envVar).toMatch(/^TRACER_/);
      expect(def.label.length).toBeGreaterThan(0);
      expect(def.description.length).toBeGreaterThan(0);
    }
  });

  test('KEY_DEFS ids are unique', () => {
    const ids = KEY_DEFS.map(def => def.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test('KEY_DEFS env vars are unique', () => {
    const envVars = KEY_DEFS.map(def => def.envVar);
    const uniqueEnvVars = new Set(envVars);
    expect(uniqueEnvVars.size).toBe(envVars.length);
  });

  test('generateEnvVarHelp produces non-empty output', () => {
    const help = generateEnvVarHelp();
    expect(help.length).toBeGreaterThan(0);
    expect(help).toContain('TRACER_BRAVE_KEY');
    expect(help).toContain('TRACER_WOLFRAMALPHA_KEY');
    expect(help).toContain('TRACER_NETLAS_KEY');
    expect(help).toContain('TRACER_DEHASHED_KEY');
    expect(help).toContain('TRACER_HIBP_KEY');
    expect(help).toContain('TRACER_GREYNOISE_KEY');
  });

  test('generateEnvVarMarkdownTable produces valid markdown', () => {
    const table = generateEnvVarMarkdownTable();
    expect(table).toContain('| Variable | Description |');
    expect(table).toContain('|----------|-------------|');
    expect(table).toContain('| `TRACER_BRAVE_KEY` |');
    expect(table).toContain('| `TRACER_WOLFRAMALPHA_KEY` |');
    expect(table).toContain('| `TRACER_NETLAS_KEY` |');
    expect(table).toContain('| `TRACER_DEHASHED_KEY` |');
    expect(table).toContain('| `TRACER_HIBP_KEY` |');
    expect(table).toContain('| `TRACER_GREYNOISE_KEY` |');
    
    // Check that all rows are formatted correctly
    const lines = table.split('\n');
    expect(lines.length).toBe(KEY_DEFS.length + 2); // header + separator + data rows
  });
});
