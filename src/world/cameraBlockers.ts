import * as THREE from 'three'

/**
 * Registry of meshes that the camera should not clip through (walls, ceiling, etc.).
 */
export class CameraBlockers {
  /** The list of registered camera-blocking meshes. */
  readonly meshes: THREE.Mesh[] = []

  /**
   * Registers a mesh as a camera blocker.
   * @param mesh - The mesh to add to the blocker list
   */
  register(mesh: THREE.Mesh): void {
    this.meshes.push(mesh)
  }
}

const instance = new CameraBlockers()

/** Meshes that the camera should not clip through (walls, ceiling, etc.). */
export const cameraBlockers: THREE.Mesh[] = instance.meshes

/**
 * Registers a mesh as a camera blocker.
 * @param mesh - The mesh to add to the blocker list
 */
export const registerCameraBlocker = (mesh: THREE.Mesh): void => instance.register(mesh)
