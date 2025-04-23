import { Vector2 } from "../values/Vector2";
import { Axes } from "../values/Axes";
import { Color4, ColourInfo } from "../values/Color4";
import { CodeGenerator } from "../CodeGenerator";
import { ICodeGenElement } from "../ICodeGenElement";
import { PropertyBuilder } from "../codegen/PropertyBuilder";
import { assign } from "../util/assign";
import { Anchor } from "../values/Anchor";

export interface DrawableOptions {
  readonly position?: Vector2
  readonly x?: number
  readonly y?: number
  readonly size?: Vector2
  readonly width?: number
  readonly height?: number
  readonly rotation?: number
  readonly colour?: ColourInfo
  readonly relativeSizeAxes?: Axes
  readonly relativePositionAxes?: Axes
  readonly alpha?: number
  readonly anchor?: Anchor
  readonly origin?: Anchor
}

export class Drawable implements ICodeGenElement {
  position = new Vector2()
  size = new Vector2()
  relativePositionAxes = Axes.None
  colour: ColourInfo = Color4.white()
  alpha = 1
  anchor = Anchor.TopLeft
  origin = Anchor.TopLeft
  rotation = 0
  _relativeSizeAxes = Axes.None

  supportsPadding = false

  get x() {
    return this.position.x
  }

  set x(value) {
    this.position = this.position.withX(value)
  }

  get y() {
    return this.position.y
  }

  set y(value) {
    this.position = this.position.withY(value)
  }

  get width() {
    return this.size.x
  }

  set width(value) {
    this.size = this.size.withX(value)
  }

  get height() {
    return this.size.y
  }

  set height(value) {
    this.size = this.size.withY(value)
  }

  get relativeSizeAxes() {
    return this._relativeSizeAxes
  }

  set relativeSizeAxes(value: Axes) {
    this._relativeSizeAxes = value
    if ((value & Axes.X) && this.width == 0)
      this.width = 1
    if ((value & Axes.Y) && this.height == 0)
      this.height = 1
  }

  constructor(public name: string, options: DrawableOptions = {}) {
    assign(this, options)
  }

  public encode(generator: CodeGenerator): string {
    const properties = new PropertyBuilder(generator)

    this.buildInitializerProperties(properties, generator)

    return [
      `new ${this.getNameWithParameters()}`,
      '{',
      properties.toString(1),
      '}',
    ].join('\n')
  }

  protected getNameWithParameters() {
    return this.name
  }

  defaultSize() {
    const size = new Vector2()

    if (this.relativeSizeAxes & Axes.X)
      size.x = 1
    if (this.relativeSizeAxes & Axes.Y)
      size.y = 1

    return size
  }

  protected buildInitializerProperties(properties: PropertyBuilder, generator: CodeGenerator) {
    if (this.relativeSizeAxes !== Axes.None)
      properties.putAxes('RelativeSizeAxes', this.relativeSizeAxes)

    if (this.relativePositionAxes !== Axes.None)
      properties.putAxes('RelativePositionAxes', this.relativePositionAxes)

    properties.putVector2WithAxes('Position', 'X', 'Y', this.position, Vector2.zero())
    properties.putVector2WithAxes('Size', 'Width', 'Height', this.size, this.defaultSize())

    if (this.alpha !== 1)
      properties.putFloat('Alpha', this.alpha)

    if (!this.colour.isWhite())
      properties.put('Colour', this.colour)

    if (this.anchor !== Anchor.TopLeft)
      properties.putAnchor('Anchor', this.anchor)
    if (this.origin !== Anchor.TopLeft)
      properties.putAnchor('Origin', this.origin)

    if (this.rotation !== 0)
      properties.putFloat('Rotation', this.rotation * 180 / Math.PI)
  }
}