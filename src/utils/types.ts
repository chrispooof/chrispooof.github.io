import * as THREE from 'three'

/**
 * Abstract base class for Three.js scene features.
 * Stores a reference to the scene so subclasses can add meshes and lights directly.
 */
export class BaseFeature {
  protected scene: THREE.Scene

  constructor(scene: THREE.Scene) {
    this.scene = scene
  }
}
