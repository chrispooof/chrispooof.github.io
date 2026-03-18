/** A circular collision boundary in the XZ plane. */
interface Collider {
  x: number
  z: number
  radius: number
}

/**
 * Registry of circular collision boundaries in the XZ plane.
 * Used to prevent the player from walking through objects.
 */
class Colliders {
  private readonly colliders: Collider[] = []

  /**
   * Registers a circular collider at the given world position.
   * @param x - World X position
   * @param z - World Z position
   * @param radius - Collision radius
   */
  register(x: number, z: number, radius: number): void {
    this.colliders.push({ x, z, radius })
  }

  /**
   * Returns true if a circle at (x, z) with the given radius overlaps any registered collider.
   * @param x - World X position to test
   * @param z - World Z position to test
   * @param entityRadius - Radius of the entity being tested
   */
  check(x: number, z: number, entityRadius: number): boolean {
    return this.colliders.some((c) => Math.hypot(x - c.x, z - c.z) < c.radius + entityRadius)
  }
}

const colliders = new Colliders()

/**
 * Registers a circular collider at the given world position.
 * @param x - World X position
 * @param z - World Z position
 * @param radius - Collision radius
 */
export const registerCollider = (x: number, z: number, radius: number): void =>
  colliders.register(x, z, radius)

/**
 * Returns true if a circle at (x, z) with the given radius overlaps any registered collider.
 * @param x - World X position to test
 * @param z - World Z position to test
 * @param entityRadius - Radius of the entity being tested
 */
export const checkCollision = (x: number, z: number, entityRadius: number): boolean =>
  colliders.check(x, z, entityRadius)
