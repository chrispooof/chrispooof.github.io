import * as THREE from 'three'
import { Terrain } from '../world/terrain'
import { treeLocations, rockLocations } from '../world/features/locations'
import { Tree } from '../world/features/tree'
import { Rock } from '../world/features/rock'

const _raycaster = new THREE.Raycaster()
const _downDir = new THREE.Vector3(0, -1, 0)
const _rayOrigin = new THREE.Vector3()

/**
 * @description
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
 * @description
 * Adds trees and rocks to the scene
 *
 * @param scene - The scene to add the trees and rocks to
 */
export const addScenery = (scene: THREE.Scene) => {
  treeLocations.forEach((coordinates) => new Tree(scene).place(coordinates))
  rockLocations.forEach((coordinates) => new Rock(scene).place(coordinates))
}