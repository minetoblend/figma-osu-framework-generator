import { CodeGenerator } from "../CodeGenerator";
import { Vector2 } from "../values/Vector2";
import { encodeFloat } from "./encodeFloat";
import { ICodeGenElement } from "../ICodeGenElement";
import { Axes } from "../values/Axes";
import { withIndent } from "./withIndent";
import { encodeInitializerList } from "./encodeInitializerList";
import { Anchor } from "../values/Anchor";

export class PropertyBuilder {
  readonly properties: Record<string, string> = {}

  constructor(
      readonly generator: CodeGenerator
  ) {
  }

  toString(indent = 0) {
    return encodeInitializerList({ properties: this.properties, indent })
  }

  get(name: string): string | undefined {
    return this.properties[name]
  }

  put(name: string, value: string | ICodeGenElement) {
    if (typeof value !== 'string')
      value = value.encode(this.generator)

    this.properties[name] = value
  }

  putFloat(name: string, value: number) {
    this.put(name, encodeFloat(value))
  }

  putBoolean(name: string, value: boolean) {
    this.put(name, `${value}`)
  }

  putInt(name: string, value: number) {
    this.put(name, value.toPrecision(0))
  }

  putAxes(name: string, value: Axes) {
    this.put(name, `Axes.${Axes[value]}`)
  }

  putAnchor(name: string, value: Anchor) {
    this.put(name, `Anchor.${Anchor[value]}`)
  }

  putVector2WithAxes(
      property: string,
      xProperty: string,
      yProperty: string,
      value: Vector2,
      defaultValue: Vector2,
  ) {
    if (value.equals(defaultValue))
      return

    if (value.x !== defaultValue.x && value.y === defaultValue.y)
      this.putFloat(xProperty, value.x)
    else if (value.y !== defaultValue.y && value.x === defaultValue.x)
      this.putFloat(yProperty, value.y)
    else if (!value.equals(defaultValue))
      this.put(property, value)
  }
}