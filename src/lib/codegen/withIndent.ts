export interface IndentOptions {
  skipFirstLine?: boolean
}

export function withIndent(text: String, amount: number = 1, options: IndentOptions = {}) {
  return text.split('\n').map((line, index) => {
    if (options.skipFirstLine && index === 0)
      return line

    return '\t'.repeat(amount) + line
  }).join('\n')
}