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

const heightRay = new THREE.Raycaster()
const downDir = new THREE.Vector3(0, -1, 0)

/**
 * @description
 * Gets the height at the given position
 *
 * @param x - The x position
 * @param z - The z position
 * @returns The height at the given position
 */
export const getHeight = (x: number, z: number): number => {
  heightRay.set(new THREE.Vector3(x, 60, z), downDir)
  const hits = heightRay.intersectObject(Terrain)
  return hits.length ? hits[0].point.y : 0
}
