import { Matrix } from "../util/Matrix";

export function extractTransform(transform: Transform) {
  const matrix = new Matrix(
      transform[0][0],
      transform[0][1],
      transform[0][2],
      transform[1][0],
      transform[1][1],
      transform[1][2],
  )

  return matrix.extractTransform()
}