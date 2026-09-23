import { describe, expect, it } from 'vitest';
import { completeCommand, parseCommand, tokenize } from './terminal-parser';

describe('terminal parser', () => {
  it('supports quoted and escaped arguments without evaluation', () => {
    expect(tokenize('open "Project Overview.txt"')).toEqual(['open', 'Project Overview.txt']);
    expect(parseCommand("cat 'README.md'")).toEqual({ name: 'cat', args: ['README.md'] });
    expect(tokenize('echo hello\\ world')).toEqual(['echo', 'hello world']);
  });

  it('ranks command completions by prefix', () => {
    expect(completeCommand('pro', ['projects', 'pwd', 'profile'])).toEqual(['profile', 'projects']);
    expect(completeCommand('projects ', ['projects', 'pwd'])).toEqual([]);
  });
});
