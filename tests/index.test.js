import { CliUsageError, parseCliArgs } from '../src/index.js';

describe('parseCliArgs', () => {
  test('parses positional input and boolean flags', () => {
    expect(parseCliArgs([
      'node',
      'src/index.js',
      'alice',
      '--mode',
      'aggressive',
      '--fossils',
      '--avatars',
      '--time-slice',
      '--documents',
      '--proxy',
      'socks5://127.0.0.1:9050',
      '--tor-rotate',
    ])).toMatchObject({
      input: 'alice',
      mode: 'aggressive',
      fossils: true,
      avatars: true,
      timeSliceMode: true,
      documents: true,
      proxy: 'socks5://127.0.0.1:9050',
      torRotate: true,
      help: false,
    });
  });

  test('supports help output without input', () => {
    expect(parseCliArgs(['node', 'src/index.js', '--help']).help).toBe(true);
  });

  test('rejects unknown flags', () => {
    expect(() => parseCliArgs(['node', 'src/index.js', 'alice', '--wat']))
      .toThrow(CliUsageError);
  });

  test('rejects missing option values', () => {
    expect(() => parseCliArgs(['node', 'src/index.js', 'alice', '--mode']))
      .toThrow(CliUsageError);
  });

  test('rejects multiple positional inputs', () => {
    expect(() => parseCliArgs(['node', 'src/index.js', 'alice', 'bob']))
      .toThrow('Only one search input may be provided.');
  });
});
