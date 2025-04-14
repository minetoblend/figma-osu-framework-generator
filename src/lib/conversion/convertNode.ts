import { Unsupported } from "../drawables/Unsupported";
import { convertRectangle } from "./convertRectangle";
import { Precision } from "../util/Precision";
import { convertEllipse } from "./convertEllipse";
import { extractText } from "./extractText";

export async function convertNode(node: SceneNode, isRootNode = false) {
  switch (node.type) {
    case 'RECTANGLE':
      return convertRectangle(node, isRootNode)

    case 'ELLIPSE':
      if (Precision.almostEquals(node.width, node.height))
        return convertEllipse(node, isRootNode)
      break

    case 'TEXT':
      return extractText(node, isRootNode)
  }

  return new Unsupported(`Unsupported ${node.type} element`)
}

