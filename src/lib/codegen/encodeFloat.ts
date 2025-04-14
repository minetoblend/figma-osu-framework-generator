export function encodeFloat(value: number): string {
  if (value % 1 === 0) {
    return value.toString()
  } else {
    return value.toFixed(3) + 'f'
  }
}