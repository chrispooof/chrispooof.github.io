import * as THREE from 'three'
import { registerCollider } from '../colliders'

/** Configuration for a single flame cone. */
interface FlameConfig {
  radius: number
  height: number
  color: number
  y: number
  phaseOffset: number
}

const FLAME_CONFIGS: FlameConfig[] = [
  { radius: 0.2, height: 0.6, color: 0xff4400, y: 0.5, phaseOffset: 0 },
  { radius: 0.14, height: 0.75, color: 0xff9900, y: 0.54, phaseOffset: 1.2 },
  { radius: 0.08, height: 0.45, color: 0xffdd00, y: 0.58, phaseOffset: 2.4 },
]

/**
 * Dark Souls-style bonfire: stone base, metal bowl, sword-in-ground, animated flames,
 * and a flickering point light.
 */
class Bonfire {
  private group: THREE.Group
  private flames: THREE.Mesh[] = []
  private light: THREE.PointLight

  constructor() {
    this.group = new THREE.Group()
    this.light = new THREE.PointLight(0xff7700, 3, 12)
    this.build()
  }

  /**
   * Constructs all bonfire geometry: stone base, metal bowl, sword, and flame cones.
   */
  private build(): void {
    // Stone base slab
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.62, 0.15, 12),
      new THREE.MeshLambertMaterial({ color: 0x4a4a4a }),
    )
    base.position.y = 0.075
    base.castShadow = true
    this.group.add(base)

    // Metal fire bowl
    const bowl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.36, 0.44, 0.16, 12),
      new THREE.MeshLambertMaterial({ color: 0x222222 }),
    )
    bowl.position.y = 0.23
    this.group.add(bowl)

    // Sword handle (partially buried in coals)
    const handle = new THREE.Mesh(
      new THREE.BoxGeometry(0.07, 0.2, 0.07),
      new THREE.MeshLambertMaterial({ color: 0x3a2010 }),
    )
    handle.position.y = 0.22
    this.group.add(handle)

    // Sword crossguard
    const guard = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.055, 0.055),
      new THREE.MeshLambertMaterial({ color: 0x888888 }),
    )
    guard.position.y = 1
    this.group.add(guard)

    // Sword blade rising through the flames
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.065, 0.85, 0.025),
      new THREE.MeshLambertMaterial({ color: 0xc0c0c0 }),
    )
    blade.position.y = 0.83
    this.group.add(blade)

    // Flames — MeshBasicMaterial so they always glow regardless of scene lighting
    for (const cfg of FLAME_CONFIGS) {
      const flame = new THREE.Mesh(
        new THREE.ConeGeometry(cfg.radius, cfg.height, 8),
        new THREE.MeshBasicMaterial({ color: cfg.color, transparent: true, opacity: 0.9 }),
      )
      flame.position.y = cfg.y
      flame.userData['phaseOffset'] = cfg.phaseOffset
      this.flames.push(flame)
      this.group.add(flame)
    }

    // Point light hovers just above the coals
    this.light.position.set(0, 0.7, 0)
    this.group.add(this.light)
  }

  /**
   * Adds the bonfire to the scene at the given position and registers its collider.
   * @param scene - The scene to add the bonfire to
   * @param position - World position to place the bonfire at
   */
  place(scene: THREE.Scene, position: THREE.Vector3): void {
    this.group.position.copy(position)
    registerCollider(position.x, position.z, 0.65)
    scene.add(this.group)
  }

  /**
   * Animates flame scale and rotation, and flickers the point light intensity.
   * @param time - Total elapsed time in seconds
   */
  update(time: number): void {
    this.light.intensity = 2.8 + Math.sin(time * 7.3) * 0.5 + Math.sin(time * 13.7) * 0.2

    for (const flame of this.flames) {
      const offset = flame.userData['phaseOffset'] as number
      flame.scale.y = 0.85 + Math.sin(time * 8.5 + offset) * 0.2
      flame.scale.x = 0.9 + Math.sin(time * 6.0 + offset) * 0.12
      flame.rotation.y += 0.015
    }
  }
}

const BonfireInstance = new Bonfire()
export default BonfireInstance
