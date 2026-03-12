import * as THREE from 'three'
import { Coordinates } from '../utils/types'
import { getHeight } from './terrain'

const treeSpots: { x: number; z: number }[] = [{ x: 5, z: 6 }]

const rockSpots: Coordinates[] = [
  { x: -4, z: 8 },
  { x: 7, z: -5 },
]

/**
 * @description
 * Creates a tree at the given position
 * @param scene - The scene to add the tree to
 * @param x - The x position of the tree
 * @param z - The z position of the tree
 */
const makeTree = (scene: THREE.Scene, x: number, z: number) => {
  const g = new THREE.Group()

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.28, 1.8, 7),
    new THREE.MeshLambertMaterial({ color: 0x7a4a1e }),
  )
  trunk.position.y = 0.9
  trunk.castShadow = true
  g.add(trunk)

  const leafColors = [0x2e7d32, 0x388e3c, 0x1b5e20]
  const color = leafColors[Math.floor(Math.random() * leafColors.length)]

  for (let i = 0; i < 3; i++) {
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(1.6 - i * 0.35, 2.2, 8),
      new THREE.MeshLambertMaterial({ color }),
    )
    cone.position.y = 2 + i * 1.4
    cone.castShadow = true
    g.add(cone)
  }

  g.position.set(x, getHeight(x, z), z)
  scene.add(g)
}

/**
 * @description
 * Creates a rock at the given position
 * @param scene - The scene to add the rock to
 * @param x - The x position of the rock
 * @param z - The z position of the rock
 */
const makeRock = (scene: THREE.Scene, x: number, z: number) => {
  const r = 0.3 + Math.random() * 0.5
  const rock = new THREE.Mesh(
    new THREE.DodecahedronGeometry(r, 0),
    new THREE.MeshLambertMaterial({ color: 0x9e9e9e }),
  )
  rock.rotation.set(Math.random(), Math.random(), Math.random())
  rock.position.set(x, getHeight(x, z) + r * 0.4, z)
  rock.castShadow = true
  scene.add(rock)
}

/**
 * @description
 * Adds trees and rocks to the scene
 *
 * @param scene - The scene to add the trees and rocks to
 */
export const addScenery = (scene: THREE.Scene) => {
  treeSpots.forEach(({ x, z }) => makeTree(scene, x, z))
  rockSpots.forEach(({ x, z }) => makeRock(scene, x, z))
}
