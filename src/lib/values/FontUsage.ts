import { CodeGenerator } from "../CodeGenerator";
import { ICodeGenElement } from "../ICodeGenElement";
import { encodeFloat } from "../codegen/encodeFloat";
import { assign } from "../util/assign";

export interface FontUsageOptions {
  readonly size?: number;
  readonly family?: string;
  readonly weight?: string;
  readonly italic?: boolean;
}

export class FontUsage implements ICodeGenElement {
  constructor(options: FontUsageOptions = {}) {
    assign(this, options)
  }

  encode(generator: CodeGenerator): string {
    const args: string[] = []

    if (this.family)
      args.push(`family: ${JSON.stringify(this.family)}`)

    if (this.size !== 20)
      args.push(`size: ${encodeFloat(this.size)}`)

    if (this.weight)
      args.push(`weight: ${JSON.stringify(this.weight)}`)

    if (this.italic)
      args.push(`italics: true`)


    return `new FontUsage(${args.join(', ')})`
  }

  public size = 20
  public family?: string
  public weight?: string
  public italic?: boolean

  equals(other: FontUsage) {
    return this.size === other.size && this.family === other.family && this.weight === other.weight && this.italic === other.italic
  }

  isDefault() {
    return this.equals(new FontUsage())
  }
}