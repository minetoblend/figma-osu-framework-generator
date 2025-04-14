import { Drawable } from "./Drawable";
import { CodeGenerator } from "../CodeGenerator";

export class Unsupported extends Drawable {
  constructor(readonly message: string) {
    super('Unsupported');
  }

  public encode(generator: CodeGenerator): string {
    return `/* ${this.message} */`
  }
}