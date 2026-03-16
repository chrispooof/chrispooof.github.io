import * as THREE from 'three'
import { BaseFeature } from '../../utils/types'
import { registerCollider } from '../colliders'
import { getHeight } from '../../utils/utils'

/**
 * Stone dungeon pillar with a base slab, cylindrical column, and capital.
 */
export class Pillar extends BaseFeature {
  private mesh: THREE.Group

  constructor(scene: THREE.Scene) {
    super(scene)
    this.mesh = new THREE.Group()
    this.initialize()
  }

  /**
   * Constructs the pillar geometry: base slab, column, and capital.
   */
  initialize(): void {
    const stoneMat = new THREE.MeshLambertMaterial({ color: 0x484848 })
    const capMat = new THREE.MeshLambertMaterial({ color: 0x525252 })

    // Base slab
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.18, 0.7), capMat)
    base.position.y = 0.09
    base.castShadow = true
    this.mesh.add(base)

    // Column shaft
    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 3.2, 8), stoneMat)
    column.position.y = 1.78
    column.castShadow = true
    this.mesh.add(column)

    // Capital
    const capital = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.18, 0.65), capMat)
    capital.position.y = 3.47
    capital.castShadow = true
    this.mesh.add(capital)
  }

  /**
   * Places the pillar at the given coordinates and registers its collider.
   * @param coordinates - The world position to place the pillar at
   */
  place(coordinates: THREE.Vector3): void {
    this.mesh.position.set(coordinates.x, getHeight(coordinates), coordinates.z)
    registerCollider(coordinates.x, coordinates.z, 0.3)
    this.scene.add(this.mesh)
  }
}
