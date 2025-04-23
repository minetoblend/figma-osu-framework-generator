import { SpriteText } from "../drawables/SpriteText";
import { FontUsage } from "../values/FontUsage";
import { Unsupported } from "../drawables/Unsupported";
import { Anchor } from "../values/Anchor";
import { applyLayout } from "./applyLayout";
import { TextFlowContainer } from "../drawables/TextFlowContainer";
import { Axes } from "../values/Axes";

export function convertText(node: TextNode, isRootNode: boolean) {
  const segments = node.getStyledTextSegments(['fontSize', 'fontName', 'fontWeight', 'fills', 'textDecoration'])

  if (segments.length !== 1)
    return new Unsupported(`Rich text is not supported`)

  const { characters, fontSize, fontName, fontWeight, fills } = segments[0]

  const style = fontName.style.split(' ')

  const italic = style[style.length - 1]?.toLowerCase()?.includes('italic')

  const weight = (italic ? style.slice(0, -1) : style).join(' ')


  let textAnchor = 0 as Anchor

  switch (node.textAlignHorizontal) {
    case 'LEFT':
    case "JUSTIFIED":
      textAnchor = Anchor.TopLeft
      break
    case 'CENTER':
      textAnchor |= Anchor.x1
      break
    case 'RIGHT':
      textAnchor |= Anchor.x2
      break
  }

  switch (node.textAlignVertical) {
    case 'TOP':
      textAnchor |= Anchor.y0
      break
    case 'CENTER':
      textAnchor |= Anchor.y1
      break
    case 'BOTTOM':
      textAnchor |= Anchor.y2
      break
  }

  let drawable: SpriteText | TextFlowContainer

  if (node.textTruncation === 'DISABLED' || node.characters.includes('\n')) {
    drawable = new TextFlowContainer({
      text: characters,
      font: new FontUsage({
        family: fontName.family,
        size: fontSize,
        weight: fontWeight !== 400 ? weight : undefined,
        italic,
      }),
      textAnchor,
    })

  } else {
    drawable = new SpriteText({
      text: characters,
      font: new FontUsage({
        family: fontName.family,
        size: fontSize,
        weight: fontWeight !== 400 ? weight : undefined,
        italic,
      }),
      anchor: textAnchor,
      origin: textAnchor,
    })
  }

  const parent = applyLayout(drawable, node, isRootNode)

  if (drawable instanceof TextFlowContainer) {
    switch (node.textAutoResize) {
      case 'NONE':
      case 'TRUNCATE':
        drawable.width = node.width
        drawable.height = node.height
        break
      case 'HEIGHT':
        drawable.autoSizeAxes = Axes.Y
        drawable.size = drawable.defaultSize().withX(node.width)
        break
      case 'WIDTH_AND_HEIGHT':
        drawable.autoSizeAxes = Axes.Both
        drawable.size = drawable.defaultSize()
    }
  } else {


    switch (node.textAutoResize) {
      case 'NONE':
      case 'TRUNCATE':
        drawable.width = node.width
        drawable.height = node.height
        break
      case 'HEIGHT':
        drawable.width = node.width
        break
    }
  }

  return parent ?? drawable
}