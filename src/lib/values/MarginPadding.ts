import { ICodeGenElement } from "../ICodeGenElement";
import { CodeGenerator } from "../CodeGenerator";

export type MarginPaddingOptions = number | (MarginPaddingOptionsHorizontal & MarginPaddingOptionsVertical);

export type MarginPaddingOptionsHorizontal =
    | {
  left?: number;
  right?: number;
}
    | { horizontal: number };

export type MarginPaddingOptionsVertical =
    | {
  top?: number;
  bottom?: number;
}
    | { vertical: number };

export class MarginPadding implements ICodeGenElement {
  public left: number;
  public right: number;
  public top: number;
  public bottom: number;

  constructor(options?: MarginPaddingOptions) {
    if (typeof options === 'number') {
      this.left = this.right = this.top = this.bottom = options;
    } else if (options) {
      if ('horizontal' in options) {
        this.left = this.right = options.horizontal;
      } else {
        this.left = options.left ?? 0;
        this.right = options.right ?? 0;
      }

      if ('vertical' in options) {
        this.top = this.bottom = options.vertical;
      } else {
        this.top = options.top ?? 0;
        this.bottom = options.bottom ?? 0;
      }
    } else {
      this.left = this.right = this.top = this.bottom = 0;
    }
  }

  clone(): MarginPadding {
    return new MarginPadding({
      left: this.left,
      right: this.right,
      top: this.top,
      bottom: this.bottom,
    });
  }

  equals(other: MarginPadding): boolean {
    return (
        this.left === other.left && this.right === other.right && this.top === other.top && this.bottom === other.bottom
    );
  }

  isZero(): boolean {
    return this.left === 0 && this.right === 0 && this.top === 0 && this.bottom === 0;
  }

  public encode(generator: CodeGenerator): string {
    if (this.isZero())
      return 'new MarginPadding()'

    const { left, right, top, bottom } = this

    if (left === right && left === top && left === bottom)
      return `new MarginPadding(${generator.float(left)})`

    const properties: Record<string, any> = {}
    if (left === right && left !== 0) {
      properties.Horizontal = generator.float(left)
    } else {
      if (left !== 0)
        properties.Left = generator.float(left)
      if (right !== 0)
        properties.Right = generator.float(right)
    }

    if (top === bottom && top !== 0) {
      properties.Horizontal = generator.float(left)
    } else {
      if (top !== 0)
        properties.Top = generator.float(top)
      if (bottom !== 0)
        properties.Bottom = generator.float(bottom)
    }

    if (Object.keys(properties).length === 0)
      return 'new MarginPadding()'

    return [
      'new MarginPadding {',
      generator.initializerList({ properties, indent: 1 }),
      '}'
    ].join('\n')
  }
}
