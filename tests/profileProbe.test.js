import { buildProfileProbeHandles } from '../src/profileProbe.js';

describe('buildProfileProbeHandles', () => {
  test('derives profile handles from plain usernames and emails', () => {
    expect(buildProfileProbeHandles('Alice.Example@example.com')).toEqual([
      'alice.example',
      'aliceexample',
      'alice_example',
    ]);
  });

  test('filters out invalid handle characters', () => {
    expect(buildProfileProbeHandles('Alice Example!')).toEqual([
      'aliceexample',
      'alice_example',
      'alice-example',
    ]);
  });
});
