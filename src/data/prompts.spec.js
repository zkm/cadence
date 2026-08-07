import prompts from './prompts.js';

describe('prompts', () => {
  it('is a non-empty array of non-empty strings', () => {
    expect(Array.isArray(prompts)).toBe(true);
    expect(prompts.length).toBeGreaterThan(0);
    for (const prompt of prompts) {
      expect(typeof prompt).toBe('string');
      expect(prompt.length).toBeGreaterThan(0);
    }
  });

  it('has no duplicate entries', () => {
    expect(new Set(prompts).size).toBe(prompts.length);
  });
});
