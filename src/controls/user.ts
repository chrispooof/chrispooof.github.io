const keys = new Set<KeyboardEvent['code']>()
let interactJustPressed = false
let inputBlocked = false

document.addEventListener('keydown', (e: KeyboardEvent) => {
  keys.add(e.code)
  // Only record E presses when input is free — prevents menu key bleeds into game
  if (!inputBlocked && e.code === 'KeyE') interactJustPressed = true
})

document.addEventListener('keyup', (e: KeyboardEvent) => keys.delete(e.code))

/**
 * @description
 * Gets the current movement input from the user.
 * Returns zero movement when input is blocked (e.g. a menu is open).
 *
 * @returns An object with moveX and moveZ properties
 */
export const getMovement = (): { moveX: number; moveZ: number } => {
  if (inputBlocked) return { moveX: 0, moveZ: 0 }
  let moveX = 0
  let moveZ = 0
  if (keys.has('KeyW') || keys.has('ArrowUp')) moveZ += 1
  if (keys.has('KeyS') || keys.has('ArrowDown')) moveZ -= 1
  if (keys.has('KeyA') || keys.has('ArrowLeft')) moveX -= 1
  if (keys.has('KeyD') || keys.has('ArrowRight')) moveX += 1
  return { moveX, moveZ }
}

/**
 * Returns true once per E key tap, then resets.
 * Used by the game loop to trigger interactions.
 */
export const getInteractPressed = (): boolean => {
  const v = interactJustPressed
  interactJustPressed = false
  return v
}

/**
 * Blocks or unblocks all game input (movement + interact).
 * Called by menus and overlays when they open or close.
 * @param blocked - Whether to block input
 */
export const setInputBlocked = (blocked: boolean): void => {
  inputBlocked = blocked
  // Clear any queued interact press so it doesn't fire when unblocking
  if (blocked) interactJustPressed = false
}

/** Returns whether game input is currently blocked. */
export const isInputBlocked = (): boolean => inputBlocked
