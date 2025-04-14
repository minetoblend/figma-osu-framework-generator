import { ICodeGenElement } from "../ICodeGenElement";
import { CodeGenerator } from "../CodeGenerator";

export enum Axes {
  None = 0,
  X = 1,
  Y = 2,
  Both = X | Y,
}

export class BoxedAxes implements ICodeGenElement {
  constructor(
      public value: Axes
  ) {
  }

  public encode(generator: CodeGenerator): string {
    return `Axes.${Axes[this.value]}`
  }
}