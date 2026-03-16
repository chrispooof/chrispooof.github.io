/**
 * Seeded pseudo-random number generator (mulberry32).
 * Returns a function producing values in [0, 1).
 * @param seed - Integer seed value
 */
export const makePRNG = (seed: number): (() => number) => {
  let s = seed
  return (): number => {
    s = (s + 0x6d2b79f5) | 0
    let z = Math.imul(s ^ (s >>> 15), 1 | s)
    z = (z + Math.imul(z ^ (z >>> 7), 61 | z)) ^ z
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296
  }
}

/** Returns a random float in [min, max). */
export const rand = (rng: () => number, min: number, max: number): number =>
  min + rng() * (max - min)

/** Returns a random integer in [min, max]. */
export const randInt = (rng: () => number, min: number, max: number): number =>
  Math.floor(min + rng() * (max - min + 1))
