import * as THREE from 'three'
import { BaseFeature } from '../../utils/types'

/**
 * A wall-mounted painting in a dark wood frame with a canvas face and warm accent light.
 * Mount on the right corridor wall (positive X face), facing -X into the corridor.
 */
export class Painting extends BaseFeature {
  private mesh: THREE.Group
  private canvasColor: number

  /**
   * @param scene - The Three.js scene
   * @param canvasColor - Hex color for the canvas face (default warm parchment)
   */
  constructor(scene: THREE.Scene, canvasColor = 0xc8a46e) {
    super(scene)
    this.canvasColor = canvasColor
    this.mesh = new THREE.Group()
    this.initialize()
  }

  /** Constructs the painting geometry: canvas, frame, and accent light. */
  initialize(): void {
    const frameMat = new THREE.MeshLambertMaterial({ color: 0x2a1a0a })
    const canvasMat = new THREE.MeshLambertMaterial({
      color: this.canvasColor,
      emissive: this.canvasColor,
      emissiveIntensity: 0.15,
    })

    const canvasWidth = 1.2
    const canvasHeight = 0.9
    const frameDepth = 0.08
    const frameThickness = 0.1

    // Canvas face
    const canvas = new THREE.Mesh(new THREE.BoxGeometry(canvasWidth, canvasHeight, 0.02), canvasMat)
    this.mesh.add(canvas)

    // Frame — four border strips (top, bottom, left, right)
    const frameSegments: Array<[number, number, number, number, number]> = [
      [
        canvasWidth + frameThickness * 2,
        frameThickness,
        frameDepth,
        0,
        (canvasHeight + frameThickness) / 2,
      ],
      [
        canvasWidth + frameThickness * 2,
        frameThickness,
        frameDepth,
        0,
        -(canvasHeight + frameThickness) / 2,
      ],
      [frameThickness, canvasHeight, frameDepth, -(canvasWidth + frameThickness) / 2, 0],
      [frameThickness, canvasHeight, frameDepth, (canvasWidth + frameThickness) / 2, 0],
    ]

    for (const [w, h, d, x, y] of frameSegments) {
      const strip = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), frameMat)
      strip.position.set(x, y, -frameDepth / 2)
      strip.castShadow = true
      this.mesh.add(strip)
    }

    // Warm accent point light positioned in front of the canvas face
    const light = new THREE.PointLight(0xffcc88, 1.2, 5)
    light.position.set(-0.6, 0, 0)
    this.mesh.add(light)
  }

  /**
   * Mounts the painting on the right corridor wall at the given world position.
   * The painting faces -X (into the corridor).
   * @param position - World position of the painting centre
   */
  place(position: THREE.Vector3): void {
    // Orient so the canvas face points toward -X (into the corridor)
    this.mesh.rotation.y = -Math.PI / 2
    this.mesh.position.copy(position)
    this.scene.add(this.mesh)
  }
}
