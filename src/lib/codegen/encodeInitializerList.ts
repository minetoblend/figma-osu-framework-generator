import { withIndent } from "./withIndent";

export interface InitializerListOptions {
  properties: Record<string, string>
  indent?: number
}

export function encodeInitializerList({ properties, indent }: InitializerListOptions) {
  const text = Object.entries(properties)
      .map(([key, value]) => `${key} = ${value}`)
      .join(',\n')

  return indent ? withIndent(text, indent) : text
}