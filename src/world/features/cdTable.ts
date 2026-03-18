import * as THREE from 'three'

const woodMat = new THREE.MeshLambertMaterial({ color: 0x1e1408 })
const metalMat = new THREE.MeshLambertMaterial({ color: 0x4a4a54 })
const cdSilverMat = new THREE.MeshLambertMaterial({ color: 0x8a8a94 })

const CASE_COLORS = [
  0x1a2040, 0x201018, 0x102018, 0x1a1a10, 0x301020, 0x102030, 0x201818, 0x181820, 0x101818,
  0x281010, 0x0a1820, 0x20100a,
]
const caseMats = CASE_COLORS.map((c) => new THREE.MeshLambertMaterial({ color: c }))

const TABLE_TOP_Y = 0.8
const CD_COUNT = 10

/**
 * A table with a metal CD display rack holding individually-colored disc cases.
 * Designed to sit against the left wall — position the group D/2 in from the wall.
 * The rack faces the positive-X direction (into the corridor).
 */
export class CDTable {
  private readonly group = new THREE.Group()

  /** Depth along X (into corridor). */
  static readonly D = 0.44
  /** Width along Z (corridor direction). */
  static readonly W = 0.9

  constructor() {
    this.buildTable()
    this.buildRack()
  }

  /**
   * Adds the CD table to the scene at the given world position.
   * @param scene - The Three.js scene
   * @param position - World position; set x = wallX + D/2 so the back sits flush
   */
  place(scene: THREE.Scene, position: THREE.Vector3): void {
    this.group.position.copy(position)
    scene.add(this.group)
  }

  /**
   * Adds a box mesh to the group at the given local position.
   * @param mat - The material to apply
   * @param w - Width
   * @param h - Height
   * @param d - Depth
   * @param x - Local X position
   * @param y - Local Y position
   * @param z - Local Z position
   * @param shadows - Whether to cast and receive shadows
   */
  private box(
    mat: THREE.Material,
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
    shadows = true,
  ): void {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
    mesh.position.set(x, y, z)
    if (shadows) {
      mesh.castShadow = true
      mesh.receiveShadow = true
    }
    this.group.add(mesh)
  }

  /**
   * Builds the table base with surface and legs.
   */
  private buildTable(): void {
    const ty = TABLE_TOP_Y
    // Table surface
    this.box(woodMat, CDTable.D, 0.05, CDTable.W, 0, ty, 0)
    // Four legs
    const legH = ty - 0.025
    for (const [lx, lz] of [
      [-0.18, -0.4],
      [-0.18, 0.4],
      [0.18, -0.4],
      [0.18, 0.4],
    ] as const) {
      this.box(woodMat, 0.06, legH, 0.06, lx, legH / 2, lz)
    }
    // Low stretcher between legs
    this.box(woodMat, CDTable.D, 0.02, CDTable.W - 0.04, 0, 0.35, 0)
  }

  /**
   * Builds the metal rack with tray, back panel, front rail, and vertical dividers.
   */
  private buildRack(): void {
    const ry = TABLE_TOP_Y + 0.025

    // Bottom tray
    this.box(metalMat, 0.36, 0.02, 0.82, 0, ry + 0.01, 0)
    // Back support panel (local -X, toward wall)
    this.box(metalMat, 0.025, 0.22, 0.82, -0.16, ry + 0.12, 0)
    // Front guide rail (local +X, toward corridor)
    this.box(metalMat, 0.018, 0.05, 0.82, 0.16, ry + 0.035, 0)

    // Vertical slot dividers
    const totalZ = 0.76
    for (let i = 1; i < CD_COUNT; i++) {
      const dz = -totalZ / 2 + (i / CD_COUNT) * totalZ
      this.box(metalMat, 0.28, 0.18, 0.012, 0, ry + 0.1, dz, false)
    }

    // CDs — one per slot, standing vertically, face toward -X (corridor/player)
    const cdGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.005, 24)
    for (let i = 0; i < CD_COUNT; i++) {
      const slotZ = -totalZ / 2 + (i + 0.5) * (totalZ / CD_COUNT)

      // Silver disc
      const disc = new THREE.Mesh(cdGeo, cdSilverMat)
      disc.position.set(0, ry + 0.085, slotZ)
      disc.rotation.z = Math.PI / 2 // axis along X → face points toward ±X
      disc.castShadow = true
      this.group.add(disc)

      // Colored case label on the front face (local +X side, toward corridor)
      const label = new THREE.Mesh(
        new THREE.BoxGeometry(0.006, 0.11, 0.11),
        caseMats[i % caseMats.length],
      )
      label.position.set(0.068, ry + 0.085, slotZ)
      this.group.add(label)
    }
  }
}
