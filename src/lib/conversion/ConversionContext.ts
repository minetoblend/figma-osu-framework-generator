
export function lookupStyleExpression(
    style: BaseStyle,
) {
  switch (style.type) {
    case "PAINT":
      return `colourProvider.${style.name}`
  }
}