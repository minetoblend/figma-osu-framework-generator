import { Drawable, DrawableOptions } from "./Drawable";
import { Container } from "./Container";
import { Axes } from "../values/Axes";
import { Vector2 } from "../values/Vector2";
import { assign } from "../util/assign";

export class Box extends Drawable {
  constructor(options: DrawableOptions = {}) {
    super('Box', options);
  }

  withCornerRadius(cornerRadius: number, cornerExponent: number = 2, parent?: Container) {
    if (parent) {
      assign(parent, {
        masking: true,
        cornerRadius: cornerRadius,
        cornerExponent: cornerExponent,
        child: this,
      })
    } else {
      parent = new Container({
        position: this.position,
        size: this.size,
        rotation: this.rotation,
        relativeSizeAxes: this.relativeSizeAxes,
        relativePositionAxes: this.relativePositionAxes,
        masking: true,
        cornerRadius: cornerRadius,
        cornerExponent: cornerExponent,
        child: this,
      })
    }

    this.position = new Vector2()
    this.size = new Vector2(1)
    this.relativeSizeAxes = Axes.Both
    this.relativePositionAxes = Axes.None

    return parent!
  }
}