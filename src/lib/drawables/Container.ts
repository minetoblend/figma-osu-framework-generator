import { Drawable, DrawableOptions } from "./Drawable";
import { Axes } from "../values/Axes";
import { PropertyBuilder } from "../codegen/PropertyBuilder";
import { CodeGenerator } from "../CodeGenerator";
import { encodeArray } from "../codegen/encodeArray";
import { assign } from "../util/assign";
import { MarginPadding } from "../values/MarginPadding";

export interface ContainerOptions extends DrawableOptions {
  readonly name?: string,
  readonly children?: readonly Drawable[]
  readonly child?: Drawable
  readonly masking?: boolean
  readonly padding?: MarginPadding
  readonly autoSizeAxes?: Axes
  readonly cornerRadius?: number
  readonly cornerExponent?: number
}

export class Container extends Drawable {
  children: Drawable[] = [];
  masking = false;
  cornerRadius = 0;
  cornerExponent = 2;
  autoSizeAxes = Axes.None;
  padding = new MarginPadding()

  constructor(options: ContainerOptions = {}) {
    const {
      name = 'Container',
      children,
      child,
      masking,
      padding,
      autoSizeAxes,
      cornerRadius,
      cornerExponent,
      ...rest
    } = options

    super(name, rest);

    assign(this, {
      children,
      child,
      masking,
      padding,
      autoSizeAxes,
      cornerRadius,
      cornerExponent,
    })
  }

  get child(): Drawable | undefined {
    return this.children[0]
  }

  set child(drawable: Drawable) {
    this.children = [drawable]
  }

  protected buildInitializerProperties(properties: PropertyBuilder, generator: CodeGenerator) {
    super.buildInitializerProperties(properties, generator);

    if (this.autoSizeAxes !== Axes.None)
      properties.putAxes('AutoSizeAxes', this.autoSizeAxes)
    if (!this.padding.isZero())
      properties.put('Padding', this.padding)

    if (this.masking)
      properties.putBoolean('Masking', this.masking)
    if (this.cornerRadius)
      properties.putFloat('CornerRadius', this.cornerRadius)
    if (this.cornerExponent !== 2)
      properties.putFloat('CornerExponent', this.cornerExponent)

    if (this.children.length > 1) {
      properties.put('Children', encodeArray({
        typeName: this.allChildrenOfSameType() ? undefined : 'Drawable',
        values: this.children,
        generator

      }))
    } else if (this.children.length === 1) {
      properties.put('Child', this.children[0])
    }
  }

  protected allChildrenOfSameType() {
    return new Set<string>(this.children.map(it => it.name)).size === 1
  }
}

