export const EPSILON = 0.00001

export function sanityCheck (value) {
  return isFinite(value)
}

export function isZero (value) {
  return sanityCheck(value) && value >= -EPSILON && value <= EPSILON
}

export function isEqual (v1, v2) {
  return isZero(v2 - v1)
}
