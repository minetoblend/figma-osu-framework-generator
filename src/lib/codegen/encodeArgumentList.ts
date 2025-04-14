import { ICodeGenElement } from "../ICodeGenElement";
import { CodeGenerator } from "../CodeGenerator";

export function encodeArgumentList(
    generator: CodeGenerator,
    args: ICodeGenElement[],
    newLine = false
): string {
  return args.map(it => it.encode(generator)).join(newLine ? ',\n' : ',')
}