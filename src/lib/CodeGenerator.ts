export class CodeGenerator {
  indent(text: String, amount: number, skipFirstLine = false) {
    return text.split('\n').map((line, index) => {
      if (skipFirstLine && index === 0)
        return line

      return '\t'.repeat(amount) + line
    }).join('\n')
  }

  float(value: number): string {
    if (value === Math.round(value))
      return value.toFixed(0)

    return value.toPrecision(3) + 'f'
  }

  initializerList({ properties, indent }: InitializerListOptions) {
    const text = Object.entries(properties)
        .map(([key, value]) => `${key} = ${value}`)
        .join(',\n')

    return indent ? this.indent(text, indent) : text
  }
}

export interface InitializerListOptions {
  properties: Record<string, string>
  indent?: number
}