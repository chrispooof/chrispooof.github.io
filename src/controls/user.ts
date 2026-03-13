const keys = new Set<KeyboardEvent['code']>()

addEventListener('keydown', (e: KeyboardEvent) => keys.add(e.code))
addEventListener('keyup', (e: KeyboardEvent) => keys.delete(e.code))

/**
 * @description
 * Gets the current movement input from the user
 *
 * @returns An object with moveX and moveZ properties
 */
export const getMovement = (): { moveX: number; moveZ: number } => {
  let moveX = 0
  let moveZ = 0
  if (keys.has('KeyW') || keys.has('ArrowUp')) moveZ += 1
  if (keys.has('KeyS') || keys.has('ArrowDown')) moveZ -= 1
  if (keys.has('KeyA') || keys.has('ArrowLeft')) moveX -= 1
  if (keys.has('KeyD') || keys.has('ArrowRight')) moveX += 1
  return { moveX, moveZ }
}
