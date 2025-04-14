import { Vector2 } from "../values/Vector2";

export class Matrix {
  constructor(
      readonly a: number,
      readonly b: number,
      readonly tx: number,
      readonly c: number,
      readonly d: number,
      readonly ty: number,
  ) {
  }

  extractTransform() {
    const transform = {
      position: new Vector2(),
      rotation: 0,
      scale: new Vector2(),
      skew: new Vector2(),
    }

    const a = this.a;
    const b = this.b;
    const c = this.c;
    const d = this.d;

    const skewX = -Math.atan2(-c, d);
    const skewY = Math.atan2(b, a);

    const delta = Math.abs(skewX + skewY);

    if (delta < 0.00001 || Math.abs(Math.PI * 2 - delta) < 0.00001) {
      transform.rotation = skewY;
      transform.skew.x = transform.skew.y = 0;
    } else {
      transform.rotation = 0;
      transform.skew.x = skewX;
      transform.skew.y = skewY;
    }

    // next set scale
    transform.scale.x = Math.sqrt((a * a) + (b * b));
    transform.scale.y = Math.sqrt((c * c) + (d * d));

    // next set position
    transform.position.x = this.tx;
    transform.position.y = this.ty;

    return transform;
  }
}