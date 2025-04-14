import { Color4 } from "../values/Color4";
import { extractTransform } from "./extractTransform";
import { Precision } from "../util/Precision";
import { Direction, EdgeDirection } from "../values/Direction";
import { LinearGradient } from "../values/LinearGradient";
import { Vector2 } from "../values/Vector2";
import { GradientSegment, MultiGradient } from "../values/MultiGradient";

export async function extractColourInfo(node: SceneNode & MinimalFillsMixin) {
  if (Array.isArray(node.fills)) {
    const fill = node.fills.find(it => (it as Paint).visible !== undefined) as Paint
    if (!fill)
      return

    let style: BaseStyle | null = null
    if (typeof node.fillStyleId === "string")
      style = await figma.getStyleByIdAsync(node.fillStyleId)

    switch (fill.type) {
      case "SOLID":
        return Color4.fromFigma(fill.color, fill.opacity).withStyle(style)
      case 'GRADIENT_LINEAR': {
        if (fill.gradientStops.length < 2)
          return

        const transform = extractTransform(fill.gradientTransform)
        let direction: EdgeDirection

        if (Precision.almostEquals(transform.rotation, 0))
          direction = EdgeDirection.Right
        else if (Precision.almostEquals(transform.rotation, Math.PI / 2))
          direction = EdgeDirection.Down
        else if (Precision.almostEquals(transform.rotation, Math.PI) || Precision.almostEquals(transform.rotation, -Math.PI))
          direction = EdgeDirection.Left
        else if (Precision.almostEquals(transform.rotation, Math.PI * 1.5))
          direction = EdgeDirection.Up
        else return

        if (
            fill.gradientStops.length > 2 ||
            fill.gradientStops[0].position !== 0 ||
            fill.gradientStops[1].position !== 0
        ) {
          const segments: GradientSegment[] = []
          for (let i = 0; i < fill.gradientStops.length - 1; i++) {
            const start = fill.gradientStops[i]
            const end = fill.gradientStops[i + 1]

            const gradient = toGradient(direction, transform, start, end)
            if (!gradient)
              return

            segments.push({
              start: start.position,
              end: end.position,
              gradient
            })
          }

          return new MultiGradient(segments)
        }

        switch (direction) {
          case EdgeDirection.Down:
            if (!Precision.almostEquals(transform.position.y, 1))
              return

            return new LinearGradient(
                Direction.Vertical,
                Color4.fromFigma(fill.gradientStops[0].color),
                Color4.fromFigma(fill.gradientStops[1].color)
            )

          case EdgeDirection.Left:
            if (!Precision.almostEquals(transform.position.x, 1))
              return
            return new LinearGradient(
                Direction.Horizontal,
                Color4.fromFigma(fill.gradientStops[1].color),
                Color4.fromFigma(fill.gradientStops[0].color)
            )

          case EdgeDirection.Up:
            if (!Precision.almostEquals(transform.position.y, 0))
              return
            return new LinearGradient(
                Direction.Vertical,
                Color4.fromFigma(fill.gradientStops[1].color),
                Color4.fromFigma(fill.gradientStops[0].color),
            )

          case EdgeDirection.Right:
            if (!Precision.almostEquals(transform.position.x, 0))
              return
            return new LinearGradient(
                Direction.Horizontal,
                Color4.fromFigma(fill.gradientStops[1].color),
                Color4.fromFigma(fill.gradientStops[0].color),
            )
        }
      }
    }
  }
}

export function toGradient(
    direction: EdgeDirection,
    transform: { position: Vector2 },
    start: ColorStop,
    end: ColorStop,
) {
  switch (direction) {
    case EdgeDirection.Down:
      if (!Precision.almostEquals(transform.position.y, 1))
        return

      return new LinearGradient(
          Direction.Vertical,
          Color4.fromFigma(start.color),
          Color4.fromFigma(end.color)
      )

    case EdgeDirection.Left:
      if (!Precision.almostEquals(transform.position.x, 1))
        return
      return new LinearGradient(
          Direction.Horizontal,
          Color4.fromFigma(end.color),
          Color4.fromFigma(start.color),
      )

    case EdgeDirection.Up:
      if (!Precision.almostEquals(transform.position.y, 0))
        return
      return new LinearGradient(
          Direction.Vertical,
          Color4.fromFigma(end.color),
          Color4.fromFigma(start.color),
      )

    case EdgeDirection.Right:
      if (!Precision.almostEquals(transform.position.x, 0))
        return
      return new LinearGradient(
          Direction.Horizontal,
          Color4.fromFigma(start.color),
          Color4.fromFigma(end.color),
      )
  }
}