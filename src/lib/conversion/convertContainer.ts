import { Container } from "../drawables/Container";
import { applyLayout } from "./applyLayout";
import { convertNode } from "./convertNode";

export async function convertContainer(node: SceneNode & ConstraintMixin & ChildrenMixin, isRootNode: boolean) {
    const drawable = new Container()

    applyLayout(drawable, node, isRootNode)

    drawable.children = await Promise.all(
        node.children
        .filter(it => it.visible)
        .map((child) =>
            convertNode(child, false)
        )
    )

    return drawable
}