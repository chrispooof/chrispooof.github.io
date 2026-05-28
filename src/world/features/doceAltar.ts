import * as THREE from 'three'
import { registerCollider } from '../colliders'

const PLINTH_HEIGHT = 1.0
const GIFT_SIZE = 0.35
const GIFT_BASE_Y = PLINTH_HEIGHT + GIFT_SIZE / 2

const PLINTH_COLOR = 0x4a4a4a
const WRAP_COLOR = 0xc24a3a
const RIBBON_COLOR = 0xe8d090
const GLOW_COLOR = 0xffb060

/**
 * Doce project altar: stone plinth with a softly-glowing wrapped gift box on top.
 * Gentle vertical bob + light flicker draw the player toward the far end of the corridor.
 */
class DoceAltar {
  private group: THREE.Group
  private giftGroup: THREE.Group
  private light: THREE.PointLight

  constructor() {
    this.group = new THREE.Group()
    this.giftGroup = new THREE.Group()
    this.light = new THREE.PointLight(GLOW_COLOR, 1.8, 6)
    this.build()
  }

  /** Constructs the plinth, the wrapped gift box, and the overhead glow. */
  private build(): void {
    // Stone plinth — slightly tapered cylinder, matches bonfire base material
    const plinth = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.55, PLINTH_HEIGHT, 12),
      new THREE.MeshLambertMaterial({ color: PLINTH_COLOR }),
    )
    plinth.position.y = PLINTH_HEIGHT / 2
    plinth.castShadow = true
    plinth.receiveShadow = true
    this.group.add(plinth)

    // Gift box — wrapped cube
    const wrapMaterial = new THREE.MeshLambertMaterial({ color: WRAP_COLOR })
    const box = new THREE.Mesh(new THREE.BoxGeometry(GIFT_SIZE, GIFT_SIZE, GIFT_SIZE), wrapMaterial)
    box.castShadow = true
    this.giftGroup.add(box)

    // Two crossed ribbon strips — slightly larger than the cube so they show as a band
    const ribbonMaterial = new THREE.MeshLambertMaterial({ color: RIBBON_COLOR })
    const ribbonThickness = 0.06
    const ribbonOversize = GIFT_SIZE + 0.005

    const ribbonX = new THREE.Mesh(
      new THREE.BoxGeometry(ribbonOversize, ribbonOversize, ribbonThickness),
      ribbonMaterial,
    )
    this.giftGroup.add(ribbonX)

    const ribbonZ = new THREE.Mesh(
      new THREE.BoxGeometry(ribbonThickness, ribbonOversize, ribbonOversize),
      ribbonMaterial,
    )
    this.giftGroup.add(ribbonZ)

    // Bow — small torus knot perched on the top face
    const bow = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.025, 8, 16), ribbonMaterial)
    bow.position.y = GIFT_SIZE / 2 + 0.025
    bow.rotation.x = Math.PI / 2
    this.giftGroup.add(bow)

    this.giftGroup.position.y = GIFT_BASE_Y
    this.group.add(this.giftGroup)

    // Warm glow hovering above the gift
    this.light.position.set(0, GIFT_BASE_Y + 0.5, 0)
    this.group.add(this.light)
  }

  /**
   * Adds the altar to the scene at the given position and registers its collider.
   * @param scene - The scene to add the altar to
   * @param position - World position to place the altar at
   */
  place(scene: THREE.Scene, position: THREE.Vector3): void {
    this.group.position.copy(position)
    registerCollider(position.x, position.z, 0.55)
    scene.add(this.group)
  }

  /**
   * Animates the gift's gentle vertical bob and the light's warm flicker.
   * @param time - Total elapsed time in seconds
   */
  update(time: number): void {
    this.giftGroup.position.y = GIFT_BASE_Y + Math.sin(time * 1.5) * 0.04
    this.giftGroup.rotation.y = time * 0.3
    this.light.intensity = 1.6 + Math.sin(time * 2.1) * 0.3 + Math.sin(time * 5.7) * 0.1
  }
}

const DoceAltarInstance = new DoceAltar()
export default DoceAltarInstance
