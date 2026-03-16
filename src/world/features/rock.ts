import * as THREE from 'three'
import { BaseFeature } from '../../utils/types'
import { registerCollider } from '../colliders'
import { getHeight } from '../../utils/utils'

export class Rock extends BaseFeature {
  private mesh: THREE.Group
  private radius: number

  constructor(scene: THREE.Scene) {
    super(scene)
    this.mesh = new THREE.Group()
    this.radius = 0.3 + Math.random() * 0.5
    this.initialize()
  }

  /**
   * @description
   * Initializes the rock mesh
   */
  initialize(): void {
    const rock = new THREE.Mesh(
      new THREE.DodecahedronGeometry(this.radius, 0),
      new THREE.MeshLambertMaterial({ color: 0x585858 }),
    )
    rock.rotation.set(Math.random(), Math.random(), Math.random())
    rock.castShadow = true
    this.mesh.add(rock)
  }

  /**
   * @description
   * Places the rock at the given coordinates and registers its collider.
   * @param coordinates - The coordinates to place the rock at
   */
  place(coordinates: THREE.Vector3): void {
    this.mesh.position.set(coordinates.x, getHeight(coordinates) + this.radius * 0.4, coordinates.z)
    registerCollider(coordinates.x, coordinates.z, this.radius * 1.1)
    this.scene.add(this.mesh)
  }
}
