import { convertNode } from "./lib/conversion/convertNode";
import { CodeGenerator } from "./lib/CodeGenerator";

export default function () {
  if (figma.editorType === "dev" && figma.mode === "codegen") {
    // Register a callback to the "generate" event
    figma.codegen.on("generate", async ({ node }) => {
      const drawable = await convertNode(node, true)

      return [{
        title: node.name,
        language: "PLAINTEXT",
        code: drawable.encode(new CodeGenerator()),
      }]
    })
  }
}