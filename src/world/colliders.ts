interface Collider {
  x: number
  z: number
  radius: number
}

/** Populated by Tree and Rock when placed — checked by the game loop before moving the player. */
const colliders: Collider[] = []

/**
 * Registers a circular collider at the given world position.
 * @param x - World X position
 * @param z - World Z position
 * @param radius - Collision radius
 */
export const registerCollider = (x: number, z: number, radius: number): void => {
  colliders.push({ x, z, radius })
}

/**
 * Returns true if a circle at (x, z) with the given radius overlaps any registered collider.
 * @param x - World X position to test
 * @param z - World Z position to test
 * @param entityRadius - Radius of the entity being tested
 */
export const checkCollision = (x: number, z: number, entityRadius: number): boolean =>
  colliders.some((c) => Math.hypot(x - c.x, z - c.z) < c.radius + entityRadius)
