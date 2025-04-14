import { CodeGenerator } from "../CodeGenerator";
import { Color4, ColourInfo } from "./Color4";
import { Direction } from "./Direction";
import { withIndent } from "../codegen/withIndent";
import { encodeArgumentList } from "../codegen/encodeArgumentList";

export class LinearGradient implements ColourInfo {
  constructor(
      readonly direction: Direction,
      readonly start: Color4,
      readonly end: Color4,
  ) {
  }

  public isWhite(): boolean {
    return false
  }

  encode(generator: CodeGenerator): string {
    const functionName = this.direction === Direction.Horizontal
        ? 'GradientHorizontal'
        : 'GradientVertical'

    return [
      `ColourInfo.${functionName}(`,
      withIndent(
          encodeArgumentList(generator, [this.start, this.end], true)
      ),
      ')',
    ].join('\n')
  }
}

