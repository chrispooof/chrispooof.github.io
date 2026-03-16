import * as THREE from 'three'
import { CORRIDOR_HALF_LENGTH, CORRIDOR_HALF_WIDTH, WALL_HEIGHT } from '../utils/constants'
import { makePRNG, rand, randInt } from '../utils/rng'

const WX = CORRIDOR_HALF_WIDTH
const WZ = CORRIDOR_HALF_LENGTH

const rubbleMats = [
  new THREE.MeshLambertMaterial({ color: 0x252525 }),
  new THREE.MeshLambertMaterial({ color: 0x1c1c1c }),
  new THREE.MeshLambertMaterial({ color: 0x303030 }),
]
const crackMat = new THREE.MeshBasicMaterial({ color: 0x040404 })
const stainMat = new THREE.MeshLambertMaterial({ color: 0x0c0c0c })
const streakMat = new THREE.MeshBasicMaterial({ color: 0x070710, transparent: true, opacity: 0.7 })
const slabMat = new THREE.MeshLambertMaterial({ color: 0x222222 })

/** Places a single box mesh at the given position with optional shadow casting. */
const addBox = (
  scene: THREE.Scene,
  mat: THREE.Material,
  w: number,
  h: number,
  d: number,
  x: number,
  y: number,
  z: number,
  rx = 0,
  ry = 0,
  rz = 0,
  shadows = false,
): void => {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
  mesh.position.set(x, y, z)
  mesh.rotation.set(rx, ry, rz)
  if (shadows) {
    mesh.castShadow = true
    mesh.receiveShadow = true
  }
  scene.add(mesh)
}

/** Procedurally generates rubble chunks scattered along both walls. */
const addRubble = (scene: THREE.Scene, rng: () => number): void => {
  const count = 24
  for (let i = 0; i < count; i++) {
    const side = i % 2 === 0 ? -1 : 1
    const z = rand(rng, -WZ + 0.5, WZ - 0.5)
    const inset = rand(rng, 0.06, 0.28)
    const w = rand(rng, 0.07, 0.28)
    const h = rand(rng, 0.03, 0.13)
    const d = rand(rng, 0.06, 0.22)
    const ry = rand(rng, 0, Math.PI * 2)
    const mat = rubbleMats[randInt(rng, 0, 2)]
    addBox(scene, mat, w, h, d, side * (WX - inset), h / 2, z, 0, ry, 0, true)
  }
}

/** Procedurally generates vertical crack marks embedded in wall faces. */
const addWallCracks = (scene: THREE.Scene, rng: () => number): void => {
  const count = 12
  for (let i = 0; i < count; i++) {
    const side = i % 2 === 0 ? -1 : 1
    const z = rand(rng, -WZ + 0.5, WZ - 0.5)
    const yc = rand(rng, 0.8, WALL_HEIGHT - 0.5)
    const h = rand(rng, 0.4, 1.4)
    const tilt = rand(rng, -0.35, 0.35)
    addBox(scene, crackMat, 0.012, h, 0.05, side * (WX - 0.006), yc, z, 0, 0, tilt)
  }
}

/** Procedurally generates moisture streaks running down wall faces. */
const addWaterStreaks = (scene: THREE.Scene, rng: () => number): void => {
  const count = 8
  for (let i = 0; i < count; i++) {
    const side = i % 2 === 0 ? -1 : 1
    const z = rand(rng, -WZ + 0.5, WZ - 0.5)
    const h = rand(rng, 1.5, 3.0)
    const yTop = rand(rng, WALL_HEIGHT - 1.5, WALL_HEIGHT - 0.2)
    addBox(scene, streakMat, 0.008, h, 0.04, side * (WX - 0.005), yTop - h / 2, z)
  }
}

/** Procedurally generates dark stain patches on the floor. */
const addFloorStains = (scene: THREE.Scene, rng: () => number): void => {
  const count = 10
  for (let i = 0; i < count; i++) {
    const x = rand(rng, -(WX - 0.4), WX - 0.4)
    const z = rand(rng, -WZ + 0.5, WZ - 0.5)
    const w = rand(rng, 0.4, 1.2)
    const d = rand(rng, 0.3, 1.0)
    addBox(scene, stainMat, w, 0.004, d, x, 0.002, z)
  }
}

/** Procedurally generates fallen stone slabs lying on the floor near walls. */
const addFallenSlabs = (scene: THREE.Scene, rng: () => number): void => {
  const count = 5
  for (let i = 0; i < count; i++) {
    const side = i % 2 === 0 ? -1 : 1
    const z = rand(rng, -WZ + 1, WZ - 1)
    const inset = rand(rng, 0.25, 0.55)
    const w = rand(rng, 0.45, 0.7)
    const h = rand(rng, 0.055, 0.08)
    const d = rand(rng, 0.28, 0.42)
    const ry = side * rand(rng, 0.15, 0.4)
    addBox(scene, slabMat, w, h, d, side * (WX - inset), h / 2, z, 0, ry, 0, true)
  }
}

/**
 * Adds procedurally-generated dilapidation details to the corridor:
 * rubble chunks, wall cracks, moisture streaks, floor stains, and fallen stone slabs.
 * A fixed seed ensures the layout is deterministic across reloads.
 * @param scene - The Three.js scene
 */
export const addDecay = (scene: THREE.Scene): void => {
  const rng = makePRNG(0xd15ca1d)
  addRubble(scene, rng)
  addWallCracks(scene, rng)
  addWaterStreaks(scene, rng)
  addFloorStains(scene, rng)
  addFallenSlabs(scene, rng)
}
