import * as THREE from 'three'
import {
  CORRIDOR_HALF_LENGTH,
  CORRIDOR_HALF_WIDTH,
  TERRAIN_SIZE,
  WALL_HEIGHT,
  WALL_THICKNESS,
} from '../utils/constants'
import { registerCameraBlocker } from './cameraBlockers'
import { Torch } from './features/torch'

const stoneMat = new THREE.MeshLambertMaterial({ color: 0x2e2e2e })
const ceilingMat = new THREE.MeshLambertMaterial({ color: 0x1e1e1e })

const wallLength = TERRAIN_SIZE + WALL_THICKNESS * 2
const corridorWidth = CORRIDOR_HALF_WIDTH * 2

const torches: Torch[] = []

/**
 * Builds the dungeon corridor: side walls, end walls, ceiling, and wall torches.
 * Call updateTorches() each frame to animate the torches.
 * @param scene - The scene to add corridor geometry to
 */
export const addCorridor = (scene: THREE.Scene): void => {
  // Side walls
  const sideWallGeo = new THREE.BoxGeometry(WALL_THICKNESS, WALL_HEIGHT, wallLength)
  const leftWall = new THREE.Mesh(sideWallGeo, stoneMat)
  leftWall.position.set(-(CORRIDOR_HALF_WIDTH + WALL_THICKNESS / 2), WALL_HEIGHT / 2, 0)
  leftWall.receiveShadow = true
  leftWall.castShadow = true
  scene.add(leftWall)
  registerCameraBlocker(leftWall)

  const rightWall = leftWall.clone()
  rightWall.position.x = CORRIDOR_HALF_WIDTH + WALL_THICKNESS / 2
  scene.add(rightWall)
  registerCameraBlocker(rightWall)

  // End walls
  const endWallWidth = corridorWidth + WALL_THICKNESS * 2
  const endWallGeo = new THREE.BoxGeometry(endWallWidth, WALL_HEIGHT, WALL_THICKNESS)
  const farWall = new THREE.Mesh(endWallGeo, stoneMat)
  farWall.position.set(0, WALL_HEIGHT / 2, -(CORRIDOR_HALF_LENGTH + WALL_THICKNESS / 2))
  farWall.receiveShadow = true
  farWall.castShadow = true
  scene.add(farWall)
  registerCameraBlocker(farWall)

  const nearWall = farWall.clone()
  nearWall.position.z = CORRIDOR_HALF_LENGTH + WALL_THICKNESS / 2
  scene.add(nearWall)
  registerCameraBlocker(nearWall)

  // Ceiling
  const ceiling = new THREE.Mesh(
    new THREE.BoxGeometry(endWallWidth, WALL_THICKNESS, wallLength),
    ceilingMat,
  )
  ceiling.position.set(0, WALL_HEIGHT + WALL_THICKNESS / 2, 0)
  scene.add(ceiling)
  registerCameraBlocker(ceiling)

  // Wall torches — each gets a unique phase offset so they flicker independently
  const torchZPositions = [-7, -3, 3, 7]
  const wallXPositions: Array<[number, number]> = [
    [-(CORRIDOR_HALF_WIDTH - 0.15), 1],   // [torchX, inward sign for light offset]
    [CORRIDOR_HALF_WIDTH - 0.15, -1],
  ]

  let phaseIndex = 0
  for (const z of torchZPositions) {
    for (const [torchX, sign] of wallXPositions) {
      const torch = new Torch(phaseIndex * 0.73)
      torch.place(scene, new THREE.Vector3(torchX, 2.3, z), sign * 0.4)
      torches.push(torch)
      phaseIndex++
    }
  }
}

/**
 * Animates all torch flames and flickers their lights. Call every frame.
 * @param time - Total elapsed time in seconds
 */
export const updateTorches = (time: number): void => {
  torches.forEach((torch) => torch.update(time))
}
