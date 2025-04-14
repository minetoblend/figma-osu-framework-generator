export class Precision {
  public static almostEquals(a: number, b: number, tolerance: number = 10e-5) {
    return Math.abs(a - b) < tolerance
  }
}