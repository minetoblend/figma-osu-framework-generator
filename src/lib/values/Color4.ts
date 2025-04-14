import { ICodeGenElement } from "../ICodeGenElement";
import { CodeGenerator } from "../CodeGenerator";
import { lookupStyleExpression } from "../conversion/ConversionContext";

export interface ColourInfo extends ICodeGenElement {
  isWhite(): boolean
}

export class Color4 implements ColourInfo, ICodeGenElement {
  constructor(
      public red: number,
      public green: number,
      public blue: number,
      public alpha: number = 1
  ) {
  }

  style?: BaseStyle

  withStyle(style?: BaseStyle | null) {
    this.style = style ?? undefined

    return this
  }

  isWhite() {
    const { red, green, blue, alpha } = this
    return [red, green, blue, alpha].every(it => it === 1)
  }

  static white() {
    return new Color4(1, 1, 1)
  }

  static fromFigma(color: RGB | RGBA, opacity?: number) {
    return new Color4(
        color.r,
        color.g,
        color.b,
        opacity ?? ('a' in color ? color.a : 1)
    )
  }

  public encode(generator: CodeGenerator): string {
    if (this.style) {
      const expr = lookupStyleExpression(this.style)
      if (expr)
        return expr
    }

    const { red, green, blue, alpha } = this

    if (alpha === 1) {
      const r = Math.round(red * 255)
      const g = Math.round(green * 255)
      const b = Math.round(blue * 255)

      const hex = '#' + [r, g, b].map(it => it.toString(16).padStart(2, '0')).join('')

      return `Color4Extensions.FromHex("${hex}")`
    }

    const parameters = [red, green, blue, alpha]
        .map(it => generator.float(it))
        .join(', ')

    return `new Color4(${parameters})`
  }
}