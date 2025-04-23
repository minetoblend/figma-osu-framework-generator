import { PropertyBuilder } from "../codegen/PropertyBuilder";
import { CodeGenerator } from "../CodeGenerator";
import { assign } from "../util/assign";
import { Anchor } from "../values/Anchor";
import { FontUsage } from "../values/FontUsage";
import { Container } from "./Container";
import { Drawable, DrawableOptions } from "./Drawable";

export interface TextFlowContainerOptions extends DrawableOptions {
    readonly text?: string
    readonly font?: FontUsage
    readonly textAnchor?: Anchor
}

export class TextFlowContainer extends Container {
    constructor(options: TextFlowContainerOptions = {}) {
        const { text, font, textAnchor, ...rest } = options

        super(rest);

        this.name = 'TextFlowContainer'

        assign(this, { text, font, textAnchor })
    }

    text = ''
    font = new FontUsage()
    textAnchor = Anchor.TopLeft

    supportsPadding = true

    protected getNameWithParameters(): string {
        if (this.font.isDefault())
            return this.name;

        return `${this.name}(text => text.Font = ${this.font.encode(new CodeGenerator())})`
    }

    protected buildInitializerProperties(properties: PropertyBuilder, generator: CodeGenerator) {
        super.buildInitializerProperties(properties, generator);

        if (this.text !== '')
            properties.put('Text', JSON.stringify(this.text))

        if (this.textAnchor !== Anchor.TopLeft)
            properties.putAnchor('TextAnchor', this.textAnchor)
    }
}