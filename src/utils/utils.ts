import * as THREE from 'three'
import { pillarLocations } from '../world/features/locations'
import { Pillar } from '../world/features/pillar'
import { Terrain } from '../world/terrain'

const _raycaster = new THREE.Raycaster()
const _downDir = new THREE.Vector3(0, -1, 0)
const _rayOrigin = new THREE.Vector3()

/**
 * Gets the height at the given coordinates
 *
 * @param coordinates - The coordinates to get the height at
 * @returns The height at the given coordinates
 */
export const getHeight = (coordinates: THREE.Vector3): number => {
  _rayOrigin.set(coordinates.x, 60, coordinates.z)
  _raycaster.set(_rayOrigin, _downDir)
  const hits = _raycaster.intersectObject(Terrain)
  return hits.length ? hits[0].point.y : 0
}

/**
 * Adds pillars and rocks to the dungeon scene.
 *
 * @param scene - The scene to add scenery to
 */
export const addScenery = (scene: THREE.Scene): void => {
  pillarLocations.forEach((coordinates) => new Pillar(scene).place(coordinates))
}
