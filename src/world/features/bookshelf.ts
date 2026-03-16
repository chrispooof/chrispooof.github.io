import * as THREE from 'three'
import { makePRNG, rand, randInt } from '../../utils/rng'

const woodMat = new THREE.MeshLambertMaterial({ color: 0x2a1a08 })
const shelfMat = new THREE.MeshLambertMaterial({ color: 0x1a0f04 })

const BOOK_COLORS = [
  0x1a2a4a, 0x2a1218, 0x1a2a1a, 0x2a2a12, 0x3a1a2a, 0x1a1a3a, 0x2a1a10, 0x102018, 0x2a1430,
  0x181018,
]
const bookMats = BOOK_COLORS.map((c) => new THREE.MeshLambertMaterial({ color: c }))

/**
 * A wall-mounted bookshelf with procedurally placed books.
 * Designed to sit flush against the left wall — position the group D/2 in from the wall.
 */
export class Bookshelf {
  private readonly group = new THREE.Group()

  /** Width along Z (corridor direction). */
  static readonly W = 1.0
  /** Total height. */
  static readonly H = 1.9
  /** Depth along X (into corridor). */
  static readonly D = 0.28

  constructor() {
    this.buildFrame()
    this.addBooks()
  }

  /**
   * Adds the bookshelf to the scene at the given world position.
   * @param scene - The Three.js scene
   * @param position - World position; set x = wallX + D/2 so the back sits flush
   */
  place(scene: THREE.Scene, position: THREE.Vector3): void {
    this.group.position.copy(position)
    scene.add(this.group)
  }

  /**
   * Adds a box to the bookshelf group with shadow casting and receiving.
   */
  private box(
    mat: THREE.Material,
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
  ): void {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
    mesh.position.set(x, y, z)
    mesh.castShadow = true
    mesh.receiveShadow = true
    this.group.add(mesh)
  }

  /**
   * Builds the wooden frame with back panel, side panels, top/bottom, and interior shelves.
   */
  private buildFrame(): void {
    const { W, H, D } = Bookshelf
    const hw = W / 2

    // Back panel (flat against the wall)
    this.box(shelfMat, 0.025, H, W, -D / 2 + 0.012, H / 2, 0)
    // Side panels
    this.box(woodMat, D, H, 0.04, 0, H / 2, -hw + 0.02)
    this.box(woodMat, D, H, 0.04, 0, H / 2, hw - 0.02)
    // Top and bottom
    this.box(woodMat, D, 0.04, W, 0, H - 0.02, 0)
    this.box(woodMat, D, 0.04, W, 0, 0.02, 0)
    // Three interior shelves
    for (const sy of [0.55, 1.05, 1.52]) {
      this.box(woodMat, D - 0.04, 0.022, W - 0.08, 0, sy, 0)
    }
  }

  /**
   * Adds procedurally placed books to the shelves.
   */
  private addBooks(): void {
    const { W, D } = Bookshelf
    const rng = makePRNG(0xb005e1f0)

    for (const shelfY of [0.55, 1.05, 1.52]) {
      let z = -(W / 2 - 0.06)
      while (z < W / 2 - 0.05) {
        const bw = rand(rng, 0.03, 0.07) // spine thickness along Z
        const bh = rand(rng, 0.15, 0.28) // height
        const bd = D - 0.09 // depth, fits within shelf
        const mat = bookMats[randInt(rng, 0, bookMats.length - 1)]
        // Stand on shelf surface; back of book near back panel
        this.box(mat, bd, bh, bw, -D / 2 + 0.04 + bd / 2, shelfY + 0.011 + bh / 2, z + bw / 2)
        z += bw + rand(rng, 0.001, 0.008)
      }
    }
  }
}
