import { Container } from "../drawables/Container";
import { Axes } from "../values/Axes";
import { convertNode } from "./convertNode";
import { getRelativePosition } from "./extractRelativePosition";

export async function convertGroup(group: GroupNode, isRootNode: boolean) {
    const drawable = new Container()

    drawable.autoSizeAxes = Axes.Both

    drawable.children = await Promise.all(
        group.children.map((child) => 
            convertNode(child, false)
        )
    )

    if (!isRootNode) {
        drawable.position = getRelativePosition(group)
    }

    return drawable
}
