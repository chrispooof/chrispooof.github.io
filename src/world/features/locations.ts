import * as THREE from 'three'
import {
  MIN_SCENERY_DIST,
  ROCK_COUNT,
  SPAWN_CLEAR_RADIUS,
  TERRAIN_SIZE,
  TREE_COUNT,
} from '../../utils/constants'

/** All placed positions (trees then rocks) — shared so features don't overlap each other. */
const placed: THREE.Vector3[] = []

/**
 * Returns true if (x, z) is far enough from the spawn point and all existing placements.
 * @param x - Candidate X position
 * @param z - Candidate Z position
 */
const isValid = (x: number, z: number): boolean => {
  if (Math.hypot(x, z) < SPAWN_CLEAR_RADIUS) return false
  return placed.every((p) => Math.hypot(x - p.x, z - p.z) >= MIN_SCENERY_DIST)
}

/**
 * Generates `count` random positions within the terrain bounds, respecting min-distance rules.
 * @param count - Number of positions to generate
 */
const generate = (count: number): THREE.Vector3[] => {
  const result: THREE.Vector3[] = []
  const half = TERRAIN_SIZE / 2 - 1
  let attempts = 0

  while (result.length < count && attempts < count * 50) {
    const x = (Math.random() * 2 - 1) * half
    const z = (Math.random() * 2 - 1) * half
    if (isValid(x, z)) {
      const v = new THREE.Vector3(x, 0, z)
      placed.push(v)
      result.push(v)
    }
    attempts++
  }

  return result
}

export const treeLocations = generate(TREE_COUNT)
export const rockLocations = generate(ROCK_COUNT)
