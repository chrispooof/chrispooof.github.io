import * as THREE from 'three'
import { CORRIDOR_HALF_WIDTH } from '../../utils/constants'

// Pillars aligned symmetrically along both walls at fixed Z intervals
const PILLAR_Z_POSITIONS = [-8, -5, -2, 2, 5, 8]

/** World positions of all dungeon pillars, paired symmetrically along both walls. */
export const pillarLocations: THREE.Vector3[] = PILLAR_Z_POSITIONS.flatMap((z) => [
  new THREE.Vector3(-(CORRIDOR_HALF_WIDTH - 0.8), 0, z),
  new THREE.Vector3(CORRIDOR_HALF_WIDTH - 0.8, 0, z),
])
