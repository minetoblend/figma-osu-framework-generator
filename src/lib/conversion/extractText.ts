import { SpriteText } from "../drawables/SpriteText";
import { FontUsage } from "../values/FontUsage";
import { Unsupported } from "../drawables/Unsupported";

export function extractText(node: TextNode, isRootNode: boolean) {
  const segments = node.getStyledTextSegments(['fontSize', 'fontName', 'fontWeight', 'fills', 'textDecoration'])

  if (segments.length !== 1)
    return new Unsupported(`Rich text is not supported`)


  const { characters, fontSize, fontName, fontWeight, fills } = segments[0]


  const style = fontName.style.split(' ')

  const italic = style[style.length - 1]?.toLowerCase()?.includes('italic')

  const weight = (italic ? style.slice(0, -1) : style).join(' ')

  return new SpriteText({
    text: characters,
    font: new FontUsage({
      family: fontName.family,
      size: fontSize,
      weight: fontWeight !== 400 ? weight : undefined,
      italic,
    })
  })
}