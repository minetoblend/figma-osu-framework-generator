import { Box } from "../drawables/Box";
import { Axes } from "../values/Axes";
import { Color4 } from "../values/Color4";
import { convertContainer } from "./convertContainer";
import { extractColourInfo } from "./extractColourInfo";

export async function convertFrame(node: FrameNode, isRootNode: boolean) {
  const container = await convertContainer(node, isRootNode);

  const colourInfo = await extractColourInfo(node)

  if (colourInfo instanceof Color4) {
    container.children.unshift(
      new Box({
        relativeSizeAxes: Axes.Both,
        colour: colourInfo,
      })
    )
  }

  return container
}