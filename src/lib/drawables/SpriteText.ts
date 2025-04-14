import { Drawable, DrawableOptions } from "./Drawable";
import { PropertyBuilder } from "../codegen/PropertyBuilder";
import { CodeGenerator } from "../CodeGenerator";
import { FontUsage } from "../values/FontUsage";
import { assign } from "../util/assign";

export interface SpriteTextOptions extends DrawableOptions {
  readonly text?: string
  readonly font?: FontUsage
}

export class SpriteText extends Drawable {
  constructor(options: SpriteTextOptions = {}) {
    const {text, font, ...rest} = options

    super('SpriteText', rest);

    assign(this, { text, font })
  }

  text = ''
  font = new FontUsage()

  protected buildInitializerProperties(properties: PropertyBuilder, generator: CodeGenerator) {
    super.buildInitializerProperties(properties, generator);

    if (this.text !== '')
      properties.put('Text', JSON.stringify(this.text))

    if (!this.font.isDefault())
      properties.put('Font', this.font)
  }
}