
export function extractCornerRadius(node: CornerMixin): number | undefined {
  if (typeof node.cornerRadius === 'number' && node.cornerRadius > 0)
    return node.cornerRadius
}