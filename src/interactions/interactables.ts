/** Describes something the player can interact with by pressing E. */
export interface Interactable {
  x: number
  y: number
  z: number
  radius: number
  label: string
  onInteract: () => void
}

const registry: Interactable[] = []
let nearby: Interactable | null = null

/**
 * Registers an object as interactable.
 * @param interactable - The interactable to register
 */
export const registerInteractable = (interactable: Interactable): void => {
  registry.push(interactable)
}

/**
 * Called each frame with the player's XZ position.
 * Updates which interactable (if any) is currently in range.
 * @param px - Player world X
 * @param pz - Player world Z
 */
export const updateNearby = (px: number, pz: number): void => {
  nearby = registry.find((i) => Math.hypot(px - i.x, pz - i.z) < i.radius) ?? null
}

/** Returns the interactable currently in range, or null. */
export const getNearby = (): Interactable | null => nearby
