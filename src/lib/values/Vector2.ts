import { ICodeGenElement } from "../ICodeGenElement";
import { CodeGenerator } from "../CodeGenerator";
import { Precision } from "../util/Precision";
import { encodeFloat } from "../codegen/encodeFloat";

export class Vector2 implements ICodeGenElement {
  constructor(
      public x: number = 0,
      public y: number = x,
  ) {
  }

  withX(x: number) {
    return new Vector2(x, this.y)
  }

  withY(y: number) {
    return new Vector2(this.x, y)
  }

  isZero() {
    return this.x === 0 && this.y === 0;
  }

  isOne() {
    return this.x === 1 && this.y === 1;
  }

  isXOnly() {
    return this.x !== 0 && this.y === 0;
  }

  isYOnly() {
    return this.x === 0 && this.y !== 0;
  }

  equals(other: Vector2) {
    return this.x === other.x && this.y === other.y
  }

  almostEquals(other: Vector2, tolerance?: number) {
    return Precision.almostEquals(this.x, other.x, tolerance) && Precision.almostEquals(this.y, other.y, tolerance)
  }

  public encode(generator: CodeGenerator): string {
    if (this.x === this.y)
      return `new Vector2(${encodeFloat(this.x)})`

    return `new Vector2(${encodeFloat(this.x)}, ${encodeFloat(this.y)})`
  }

  static zero(): Vector2 {
    return new Vector2()
  }

  static one(): Vector2 {
    return new Vector2(1)
  }

}