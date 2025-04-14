import { ICodeGenElement } from "../ICodeGenElement";
import { CodeGenerator } from "../CodeGenerator";
import { withIndent } from "./withIndent";

export type EncodeArrayOptions =
    | EncodeArrayStringOptions
    | EncodeArrayStringOptionsWithGenerator

export interface EncodeArrayStringOptions {
  readonly typeName?: string,
  readonly values: readonly string[],
}

export interface EncodeArrayStringOptionsWithGenerator {
  readonly typeName?: string,
  readonly generator: CodeGenerator,
  readonly values: readonly ICodeGenElement[],
}

export function encodeArray(
    options: EncodeArrayOptions
) {
  const values = options.values.map(value => {
    if (typeof value === 'string')
      return value
    return value.encode((options as EncodeArrayStringOptionsWithGenerator).generator)
  })

  const parts: string[] = []

  if (options.typeName)
    parts.push(`new ${options.typeName}[]`)
  else
    parts.push('new[]')
  parts.push('{')
  parts.push(withIndent(values.join(',\n'), 1))
  parts.push('}')

  return parts.join('\n')
}