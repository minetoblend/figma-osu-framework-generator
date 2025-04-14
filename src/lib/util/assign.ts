export function assign(target: any, properties: Record<string, any>) {
  for (const [key, value] of Object.entries(properties)) {
    if (value === undefined)
      continue

    target[key] = value
  }
}