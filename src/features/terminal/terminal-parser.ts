export interface ParsedCommand {
  name: string;
  args: string[];
}

/** Shell-like tokenizer for the sandboxed terminal; it never evaluates code. */
export function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let quote: '"' | "'" | null = null;
  let escaping = false;

  for (const character of input.trim()) {
    if (escaping) { current += character; escaping = false; continue; }
    if (character === '\\' && quote !== "'") { escaping = true; continue; }
    if (quote) {
      if (character === quote) quote = null;
      else current += character;
      continue;
    }
    if (character === '"' || character === "'") { quote = character; continue; }
    if (/\s/.test(character)) {
      if (current) { tokens.push(current); current = ''; }
      continue;
    }
    current += character;
  }
  if (escaping) current += '\\';
  if (current) tokens.push(current);
  return tokens;
}

export function parseCommand(input: string): ParsedCommand | null {
  const [name, ...args] = tokenize(input);
  return name ? { name: name.toLowerCase(), args } : null;
}

export function completeCommand(input: string, names: string[]): string[] {
  const tokens = tokenize(input);
  if (tokens.length > 1 || /\s$/.test(input)) return [];
  const prefix = (tokens[0] ?? '').toLowerCase();
  return names.filter(name => name.startsWith(prefix)).sort();
}
