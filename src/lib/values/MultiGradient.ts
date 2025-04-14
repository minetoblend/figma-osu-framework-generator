import { LinearGradient } from "./LinearGradient";

export interface GradientSegment {
  readonly start: number;
  readonly end: number;
  readonly gradient: LinearGradient;
}

export class MultiGradient {
  constructor(
      readonly segments: GradientSegment[]
  ) {
  }
}