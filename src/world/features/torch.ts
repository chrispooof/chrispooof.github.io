import * as THREE from 'three'

/** Configuration for a single torch flame cone. */
interface TorchFlameConfig {
  radius: number
  height: number
  color: number
  y: number
  phaseOffset: number
}

// Cone base sits at handle top (y=0.19). Center = 0.19 + height/2.
const FLAME_CONFIGS: TorchFlameConfig[] = [
  { radius: 0.07, height: 0.22, color: 0xff4400, y: 0.3, phaseOffset: 0 },
  { radius: 0.05, height: 0.28, color: 0xff9900, y: 0.33, phaseOffset: 1.1 },
  { radius: 0.03, height: 0.18, color: 0xffdd00, y: 0.28, phaseOffset: 2.3 },
]

/**
 * A wall-mounted dungeon torch: wooden handle, layered animated flames, and a flickering point light.
 * Group origin is the handle center — place at world Y = handle center height.
 */
export class Torch {
  private group: THREE.Group
  private flames: THREE.Mesh[] = []
  private light: THREE.PointLight
  private readonly phaseOffset: number

  /** @param phaseOffset - Per-torch time offset so torches don't flicker in sync. */
  constructor(phaseOffset = 0) {
    this.group = new THREE.Group()
    this.light = new THREE.PointLight(0xff8833, 7, 8)
    this.phaseOffset = phaseOffset
    this.build()
  }

  /**
   * Constructs the torch handle, flame cones, and point light.
   */
  private build(): void {
    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 0.38, 6),
      new THREE.MeshLambertMaterial({ color: 0x3a2010 }),
    )
    this.group.add(handle)

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

    this.group.add(this.light)
  }

  /**
   * Places the torch in the scene.
   * @param scene - The scene to add the torch to
   * @param position - World position (group origin = handle center)
   * @param lightXOffset - Optional X offset for the point light (to push it inward from wall)
   */
  place(scene: THREE.Scene, position: THREE.Vector3, lightXOffset = 0): void {
    this.group.position.copy(position)
    this.light.position.set(lightXOffset, 0.2, 0)
    scene.add(this.group)
  }

  /**
   * Animates flame scale/rotation and flickers the point light intensity.
   * @param time - Total elapsed time in seconds
   */
  update(time: number): void {
    const t = time + this.phaseOffset
    this.light.intensity = 6.5 + Math.sin(t * 7.1) * 0.9 + Math.sin(t * 13.3) * 0.4

    for (const flame of this.flames) {
      const offset = flame.userData['phaseOffset'] as number
      flame.scale.y = 0.8 + Math.sin(t * 9.0 + offset) * 0.25
      flame.scale.x = 0.85 + Math.sin(t * 6.5 + offset) * 0.18
      flame.rotation.y += 0.02
    }
  }
}
