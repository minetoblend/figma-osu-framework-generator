import { Drawable } from "../drawables/Drawable";
import { Axes } from "../values/Axes";
import { Vector2 } from "../values/Vector2";
import { MarginPadding } from "../values/MarginPadding";
import { Anchor } from "../values/Anchor";
import { Container } from "../drawables/Container";
import { extractTransform } from "./extractTransform";
import { getRelativePosition } from "./extractRelativePosition";

export function applyLayout(
    drawable: Drawable,
    node: SceneNode & ConstraintMixin,
    isRootNode = false,
) {
  let relativeSizeAxes = Axes.None
  let size = new Vector2(node.width, node.height)
  const margin = new MarginPadding()
  let anchor = Anchor.TopLeft
  let origin = Anchor.TopLeft
  let position = new Vector2(0, 0)

  if (node.parent && 'width' in node.parent) {
    const parentSize = new Vector2(node.parent.width, node.parent.height)

    const relativePosition = getRelativePosition(node)

    switch (node.constraints.horizontal) {
      case 'SCALE':
        relativeSizeAxes |= Axes.X
        size.x /= parentSize.x
        break
      case 'STRETCH':
        relativeSizeAxes |= Axes.X
        margin.left = relativePosition.x
        margin.right = parentSize.x - relativePosition.x - node.width
        size.x = 1
        break
      case 'CENTER':
        anchor = (anchor & ~Anchor.x0) | Anchor.x1
        origin = (origin & ~Anchor.x0) | Anchor.x1
        break
      case 'MIN':
        position.x = relativePosition.x
        break
      case 'MAX':
        anchor = (anchor & ~Anchor.x0) | Anchor.x2
        origin = (origin & ~Anchor.x0) | Anchor.x2
        position.x = (relativePosition.x + node.width) - parentSize.x
        break
    }

    switch (node.constraints.vertical) {
      case 'SCALE':
        relativeSizeAxes |= Axes.Y
        size.y /= parentSize.y
        break
      case 'STRETCH':
        relativeSizeAxes |= Axes.Y
        margin.top = relativePosition.y
        margin.bottom = parentSize.y - relativePosition.y - node.height
        size.y = 1
        break

      case 'CENTER':
        anchor = (anchor & ~Anchor.y0) | Anchor.y1
        origin = (origin & ~Anchor.y0) | Anchor.y1
        break
      case 'MIN':
        position.y = relativePosition.y
        break
      case 'MAX':
        anchor = (anchor & ~Anchor.y0) | Anchor.y2
        origin = (origin & ~Anchor.y0) | Anchor.y2
        position.y = (relativePosition.y + node.height) - parentSize.y
        break
    }
  } else {
    position = new Vector2(node.x, node.y)
  }

  drawable.relativeSizeAxes = relativeSizeAxes
  drawable.size = size

  let parent: Container |undefined

  if (!margin.isZero()) {
    if (drawable instanceof Container && drawable.supportsPadding) {
      drawable.padding = margin // dump hack but this should result in the correct behavior in the end
    } else {
      parent = new Container({
        relativeSizeAxes: Axes.Both,
        padding: margin,
        child: drawable,
      })
  
      parent.children.push(drawable)
  
      drawable = parent
    }    
  }

  drawable.relativeSizeAxes = relativeSizeAxes
  drawable.anchor = anchor
  drawable.origin = origin
  drawable.rotation = extractTransform(node.absoluteTransform).rotation

  if (!isRootNode)
    drawable.position = position

  return parent
}