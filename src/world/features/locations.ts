import * as THREE from 'three'
import {
  CORRIDOR_HALF_LENGTH,
  CORRIDOR_HALF_WIDTH,
  MIN_SCENERY_DIST,
  ROCK_COUNT,
  SPAWN_CLEAR_RADIUS,
} from '../../utils/constants'

/** All placed positions (pillars + rocks) — shared to prevent overlap. */
const placed: THREE.Vector3[] = []

/**
 * Returns true if (x, z) is far enough from the spawn and all existing placements.
 * @param x - Candidate X position
 * @param z - Candidate Z position
 */
const isValid = (x: number, z: number): boolean => {
  if (Math.hypot(x, z) < SPAWN_CLEAR_RADIUS) return false
  return placed.every((p) => Math.hypot(x - p.x, z - p.z) >= MIN_SCENERY_DIST)
}

// Pillars aligned symmetrically along both walls at fixed Z intervals
const PILLAR_Z_POSITIONS = [-8, -5, -2, 2, 5, 8]

export const pillarLocations: THREE.Vector3[] = PILLAR_Z_POSITIONS.flatMap((z) => {
  const pair = [
    new THREE.Vector3(-(CORRIDOR_HALF_WIDTH - 0.8), 0, z),
    new THREE.Vector3(CORRIDOR_HALF_WIDTH - 0.8, 0, z),
  ]
  pair.forEach((p) => placed.push(p))
  return pair
})

// Rocks scattered across the corridor floor
export const rockLocations: THREE.Vector3[] = (() => {
  const result: THREE.Vector3[] = []
  let attempts = 0
  while (result.length < ROCK_COUNT && attempts < ROCK_COUNT * 50) {
    const x = (Math.random() * 2 - 1) * (CORRIDOR_HALF_WIDTH - 0.8)
    const z = (Math.random() * 2 - 1) * (CORRIDOR_HALF_LENGTH - 0.5)
    if (isValid(x, z)) {
      const v = new THREE.Vector3(x, 0, z)
      placed.push(v)
      result.push(v)
    }
    attempts++
  }
  return result
})()
