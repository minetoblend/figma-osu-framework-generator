import { Drawable } from "../drawables/Drawable";
import { Axes } from "../values/Axes";
import { Vector2 } from "../values/Vector2";
import { MarginPadding } from "../values/MarginPadding";
import { Anchor } from "../values/Anchor";
import { Container } from "../drawables/Container";
import { extractTransform } from "./extractTransform";

export function applyLayout(
    drawable: Drawable,
    node: SceneNode & ConstraintMixin,
    isRootNode = false
) {
  let relativeSizeAxes = Axes.None
  let size = new Vector2(node.width, node.height)
  const padding = new MarginPadding()
  let anchor = Anchor.TopLeft
  let origin = Anchor.TopLeft
  let position = new Vector2(0, 0)

  if (node.parent && 'width' in node.parent) {
    const parentSize = new Vector2(node.parent.width, node.parent.height)

    switch (node.constraints.horizontal) {
      case 'SCALE':
        relativeSizeAxes |= Axes.X
        size.x /= parentSize.x
        break
      case 'STRETCH':
        relativeSizeAxes |= Axes.X
        padding.left = node.x
        padding.right = parentSize.x - node.x - node.width
        size.x = 1
        break
      case 'CENTER':
        anchor = (anchor & ~Anchor.x0) | Anchor.x1
        origin = (origin & ~Anchor.x0) | Anchor.x1
        break
      case 'MIN':
        position.x = node.x
        break
      case 'MAX':
        anchor = (anchor & ~Anchor.x0) | Anchor.x2
        origin = (origin & ~Anchor.x0) | Anchor.x2
        position.x = (node.x + node.width) - parentSize.x
        break
    }

    switch (node.constraints.vertical) {
      case 'SCALE':
        relativeSizeAxes |= Axes.Y
        size.y /= parentSize.y
        break
      case 'STRETCH':
        relativeSizeAxes |= Axes.Y
        padding.top = node.y
        padding.bottom = parentSize.y - node.y - node.height
        size.y = 1
        break

      case 'CENTER':
        anchor = (anchor & ~Anchor.y0) | Anchor.y1
        origin = (origin & ~Anchor.y0) | Anchor.y1
        break
      case 'MIN':
        position.y = node.y
        break
      case 'MAX':
        anchor = (anchor & ~Anchor.y0) | Anchor.y2
        origin = (origin & ~Anchor.y0) | Anchor.y2
        position.y = (node.y + node.height) - parentSize.y
        break
    }
  } else {
    position = new Vector2(node.x, node.y)
  }

  drawable.relativeSizeAxes = relativeSizeAxes
  drawable.size = size

  let parent: Container |undefined

  if (!padding.isZero()) {
    parent = new Container({
      relativeSizeAxes: Axes.Both,
      padding: padding,
      child: drawable,
    })

    parent.children.push(drawable)

    drawable = parent
  }

  drawable.relativeSizeAxes = relativeSizeAxes
  drawable.anchor = anchor
  drawable.origin = origin
  drawable.rotation = extractTransform(node.absoluteTransform).rotation

  if (!isRootNode)
    drawable.position = position

  return parent
}