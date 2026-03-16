import * as THREE from 'three'

/** Meshes that the camera should not clip through (walls, ceiling, etc.). */
export const cameraBlockers: THREE.Mesh[] = []

/**
 * Registers a mesh as a camera blocker.
 * @param mesh - The mesh to add to the blocker list
 */
export const registerCameraBlocker = (mesh: THREE.Mesh): void => {
  cameraBlockers.push(mesh)
}
