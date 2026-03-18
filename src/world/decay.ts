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

/**
 * Procedurally generates dilapidation details for the dungeon corridor.
 * A fixed seed ensures the layout is deterministic across reloads.
 */
class Decay {
  /**
   * Places a single box mesh at the given position with optional shadow casting.
   * @param scene - The Three.js scene
   * @param mat - Material to use for the box
   * @param w - Width
   * @param h - Height
   * @param d - Depth
   * @param x - World X position
   * @param y - World Y position
   * @param z - World Z position
   * @param rx - X rotation in radians
   * @param ry - Y rotation in radians
   * @param rz - Z rotation in radians
   * @param shadows - Whether to cast and receive shadows
   */
  private addBox(
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
  ): void {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
    mesh.position.set(x, y, z)
    mesh.rotation.set(rx, ry, rz)
    if (shadows) {
      mesh.castShadow = true
      mesh.receiveShadow = true
    }
    scene.add(mesh)
  }

  /**
   * Procedurally generates rubble chunks scattered along both walls.
   * @param scene - The Three.js scene
   * @param rng - The seeded PRNG function
   */
  private addRubble(scene: THREE.Scene, rng: () => number): void {
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
      this.addBox(scene, mat, w, h, d, side * (WX - inset), h / 2, z, 0, ry, 0, true)
    }
  }

  /**
   * Procedurally generates vertical crack marks embedded in wall faces.
   * @param scene - The Three.js scene
   * @param rng - The seeded PRNG function
   */
  private addWallCracks(scene: THREE.Scene, rng: () => number): void {
    const count = 12
    for (let i = 0; i < count; i++) {
      const side = i % 2 === 0 ? -1 : 1
      const z = rand(rng, -WZ + 0.5, WZ - 0.5)
      const yc = rand(rng, 0.8, WALL_HEIGHT - 0.5)
      const h = rand(rng, 0.4, 1.4)
      const tilt = rand(rng, -0.35, 0.35)
      this.addBox(scene, crackMat, 0.012, h, 0.05, side * (WX - 0.006), yc, z, 0, 0, tilt)
    }
  }

  /**
   * Procedurally generates moisture streaks running down wall faces.
   * @param scene - The Three.js scene
   * @param rng - The seeded PRNG function
   */
  private addWaterStreaks(scene: THREE.Scene, rng: () => number): void {
    const count = 8
    for (let i = 0; i < count; i++) {
      const side = i % 2 === 0 ? -1 : 1
      const z = rand(rng, -WZ + 0.5, WZ - 0.5)
      const h = rand(rng, 1.5, 3.0)
      const yTop = rand(rng, WALL_HEIGHT - 1.5, WALL_HEIGHT - 0.2)
      this.addBox(scene, streakMat, 0.008, h, 0.04, side * (WX - 0.005), yTop - h / 2, z)
    }
  }

  /**
   * Procedurally generates dark stain patches on the floor.
   * @param scene - The Three.js scene
   * @param rng - The seeded PRNG function
   */
  private addFloorStains(scene: THREE.Scene, rng: () => number): void {
    const count = 10
    for (let i = 0; i < count; i++) {
      const x = rand(rng, -(WX - 0.4), WX - 0.4)
      const z = rand(rng, -WZ + 0.5, WZ - 0.5)
      const w = rand(rng, 0.4, 1.2)
      const d = rand(rng, 0.3, 1.0)
      this.addBox(scene, stainMat, w, 0.004, d, x, 0.002, z)
    }
  }

  /**
   * Procedurally generates fallen stone slabs lying on the floor near walls.
   * @param scene - The Three.js scene
   * @param rng - The seeded PRNG function
   */
  private addFallenSlabs(scene: THREE.Scene, rng: () => number): void {
    const count = 5
    for (let i = 0; i < count; i++) {
      const side = i % 2 === 0 ? -1 : 1
      const z = rand(rng, -WZ + 1, WZ - 1)
      const inset = rand(rng, 0.25, 0.55)
      const w = rand(rng, 0.45, 0.7)
      const h = rand(rng, 0.055, 0.08)
      const d = rand(rng, 0.28, 0.42)
      const ry = side * rand(rng, 0.15, 0.4)
      this.addBox(scene, slabMat, w, h, d, side * (WX - inset), h / 2, z, 0, ry, 0, true)
    }
  }

  /**
   * Adds all procedurally-generated dilapidation details to the corridor.
   * @param scene - The Three.js scene
   */
  add(scene: THREE.Scene): void {
    const rng = makePRNG(0xd15ca1d)
    this.addRubble(scene, rng)
    this.addWallCracks(scene, rng)
    this.addWaterStreaks(scene, rng)
    this.addFloorStains(scene, rng)
    this.addFallenSlabs(scene, rng)
  }
}

const decay = new Decay()

/**
 * Adds procedurally-generated dilapidation details to the corridor:
 * rubble chunks, wall cracks, moisture streaks, floor stains, and fallen stone slabs.
 * A fixed seed ensures the layout is deterministic across reloads.
 * @param scene - The Three.js scene
 */
export const addDecay = (scene: THREE.Scene): void => decay.add(scene)
