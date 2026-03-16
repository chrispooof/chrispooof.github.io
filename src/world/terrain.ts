import * as THREE from 'three'
import {
  CORRIDOR_HALF_LENGTH,
  CORRIDOR_HALF_WIDTH,
  PLAYER_RADIUS,
  TERRAIN_SEGS,
  TERRAIN_SIZE,
} from '../utils/constants'

const terrainGeo = new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, TERRAIN_SEGS, TERRAIN_SEGS)
terrainGeo.rotateX(-Math.PI / 2)

/**
 * The dungeon floor mesh — kept full-size for raycasting correctness.
 */
export const Terrain = new THREE.Mesh(
  terrainGeo,
  new THREE.MeshLambertMaterial({ color: 0x3d3d3d }),
)
Terrain.receiveShadow = true

/**
 * The walkable boundary of the dungeon corridor.
 * Inset by PLAYER_RADIUS so the player's center never touches the wall.
 */
export const Boundaries = new THREE.Box3(
  new THREE.Vector3(
    -(CORRIDOR_HALF_WIDTH - PLAYER_RADIUS),
    -10,
    -(CORRIDOR_HALF_LENGTH - PLAYER_RADIUS),
  ),
  new THREE.Vector3(CORRIDOR_HALF_WIDTH - PLAYER_RADIUS, 10, CORRIDOR_HALF_LENGTH - PLAYER_RADIUS),
)
