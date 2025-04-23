import { Vector2 } from "../values/Vector2"

export function getRelativePosition(node: SceneNode) {
    const position = new Vector2(node.x, node.y)

    const parent = node.parent
    if (parent && 'width' in parent) {
        if (parent.type !== 'FRAME') {
            position.x -= parent.x
            position.y -= parent.y
        }
    }

    return position
}