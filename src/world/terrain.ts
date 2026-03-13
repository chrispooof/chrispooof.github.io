import * as THREE from 'three'
import { TERRAIN_SEGS, TERRAIN_SIZE } from '../utils/constants'

const terrainGeo = new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, TERRAIN_SEGS, TERRAIN_SEGS)
terrainGeo.rotateX(-Math.PI / 2)

/**
 * @description
 * The terrain mesh
 */
export const Terrain = new THREE.Mesh(
  terrainGeo,
  new THREE.MeshLambertMaterial({ color: 0x5a9e3a }),
)
Terrain.receiveShadow = true

/**
 * @description
 * The boundaries of the terrain
 */
export const Boundaries = new THREE.Box3(
  new THREE.Vector3(-TERRAIN_SIZE / 2, 0, -TERRAIN_SIZE / 2),
  new THREE.Vector3(TERRAIN_SIZE / 2, 0, TERRAIN_SIZE / 2),
)
// Add the boundaries to the terrain
Boundaries.setFromObject(Terrain)
