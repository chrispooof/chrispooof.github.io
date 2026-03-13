import * as THREE from 'three'
import { BaseFeature } from '../../utils/types'
import { registerCollider } from '../colliders'
import { getHeight } from '../../utils/utils'

export class Tree extends BaseFeature {
  private mesh: THREE.Group

  constructor(scene: THREE.Scene) {
    super(scene)
    this.mesh = new THREE.Group()
    this.initialize()
  }

  /**
   * @description
   * Initializes the tree mesh
   */
  initialize(): void {
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.28, 1.8, 7),
      new THREE.MeshLambertMaterial({ color: 0x7a4a1e }),
    )
    trunk.position.y = 0.9
    trunk.castShadow = true
    this.mesh.add(trunk)

    const leafColors = [0x2e7d32, 0x388e3c, 0x1b5e20]
    const color = leafColors[Math.floor(Math.random() * leafColors.length)]

    for (let i = 0; i < 3; i++) {
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(1.6 - i * 0.35, 2.2, 8),
        new THREE.MeshLambertMaterial({ color }),
      )
      cone.position.y = 2 + i * 1.4
      cone.castShadow = true
      this.mesh.add(cone)
    }
  }

  /**
   * @description
   * Places the tree at the given coordinates and registers its collider.
   * @param coordinates - The coordinates to place the tree at
   */
  place(coordinates: THREE.Vector3): void {
    this.mesh.position.set(coordinates.x, getHeight(coordinates), coordinates.z)
    registerCollider(coordinates.x, coordinates.z, 0.4)
    this.scene.add(this.mesh)
  }
}
