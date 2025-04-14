import { Box } from "../drawables/Box";
import { extractColourInfo } from "./extractColourInfo";
import { extractCornerRadius } from "./extractCornerRadius";
import { MultiGradient } from "../values/MultiGradient";
import { Container } from "../drawables/Container";
import { Axes } from "../values/Axes";
import { Direction } from "../values/Direction";
import { applyLayout } from "./applyLayout";
import { Color4 } from "../values/Color4";

export async function convertRectangle(node: RectangleNode, isRootNode: boolean) {
  const box = new Box()

  let parent = applyLayout(box, node)

  const cornerRadius = extractCornerRadius(node)
  if (cornerRadius) {
    parent = box.withCornerRadius(cornerRadius, node.cornerSmoothing + 2, parent)
    if (cornerRadius >= node.width / 2 || cornerRadius >= node.height / 2) {
      parent.name = 'CircularContainer'
      parent.cornerRadius = 0
    }
  }

  const colour = await extractColourInfo(node) ?? Color4.white()
  if (colour instanceof MultiGradient) {
    const children = generateMultiGradientChildren(colour)

    if (parent)
      parent.children = children
    else
      parent = new Container({ children })

  } else {
    box.colour = colour
  }


  return parent ?? box
}

export function generateMultiGradientChildren(gradient: MultiGradient) {
  const children = gradient.segments.map(segment => {
    switch (segment.gradient.direction) {
      case Direction.Horizontal:
        return new Box({
          colour: segment.gradient,
          relativeSizeAxes: Axes.Both,
          relativePositionAxes: Axes.X,
          x: segment.start,
          width: segment.end - segment.start,
        })
      case Direction.Vertical:
        return new Box({
          colour: segment.gradient,
          relativeSizeAxes: Axes.Both,
          relativePositionAxes: Axes.Y,
          y: segment.start,
          height: segment.end - segment.start,
        })
    }
  })


  if (gradient.segments[0].start > 0) {
    const segment = gradient.segments[0]

    switch (segment.gradient.direction) {
      case Direction.Horizontal:
        children.unshift(new Box({
          colour: segment.gradient.start,
          relativeSizeAxes: Axes.Both,
          relativePositionAxes: Axes.X,
          width: segment.start,
        }))
        break
      case Direction.Vertical:
        children.unshift(new Box({
          colour: segment.gradient.start,
          relativeSizeAxes: Axes.Both,
          relativePositionAxes: Axes.Y,
          height: segment.start,
        }))
        break
    }
  }

  if (gradient.segments[gradient.segments.length - 1].start > 0) {
    const segment = gradient.segments[gradient.segments.length - 1]

    switch (segment.gradient.direction) {
      case Direction.Horizontal:
        children.push(new Box({
          colour: segment.gradient.end,
          relativeSizeAxes: Axes.Both,
          relativePositionAxes: Axes.X,
          x: segment.start,
          width: segment.end - segment.start,
        }))
        break
      case Direction.Vertical:
        children.push(new Box({
          colour: segment.gradient.end,
          relativeSizeAxes: Axes.Both,
          relativePositionAxes: Axes.Y,
          y: segment.start,
          height: segment.end - segment.start,
        }))
        break
    }
  }

  return children
}