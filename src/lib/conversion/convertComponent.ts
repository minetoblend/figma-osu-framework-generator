import { Container } from "../drawables/Container";
import { applyLayout } from "./applyLayout";
import { convertNode } from "./convertNode";

export async function convertComponent(node: ComponentNode, isRootNode: boolean) {
    const drawable = new Container()

    applyLayout(drawable, node, isRootNode)

    drawable.children = await Promise.all(
        node.children.map((child) =>
            convertNode(child, false)
        )
    )

    return drawable
}