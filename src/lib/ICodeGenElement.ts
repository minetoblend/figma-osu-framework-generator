import { CodeGenerator } from "./CodeGenerator";

export interface ICodeGenElement {
  encode(generator: CodeGenerator): string;
}