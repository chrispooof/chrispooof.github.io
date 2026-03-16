const keys = new Set<KeyboardEvent['code']>()
let interactJustPressed = false
let inputBlocked = false
let touchMoveX = 0
let touchMoveZ = 0

document.addEventListener('keydown', (e: KeyboardEvent) => {
  keys.add(e.code)
  // Only record E presses when input is free — prevents menu key bleeds into game
  if (!inputBlocked && e.code === 'KeyE') interactJustPressed = true
})

document.addEventListener('keyup', (e: KeyboardEvent) => keys.delete(e.code))

/**
 * Gets the current movement input from the user, blending keyboard and touch joystick.
 * Returns zero movement when input is blocked (e.g. a menu is open).
 * @returns An object with moveX and moveZ properties
 */
export const getMovement = (): { moveX: number; moveZ: number } => {
  if (inputBlocked) return { moveX: 0, moveZ: 0 }
  let moveX = touchMoveX
  let moveZ = touchMoveZ
  if (keys.has('KeyW') || keys.has('ArrowUp')) moveZ += 1
  if (keys.has('KeyS') || keys.has('ArrowDown')) moveZ -= 1
  if (keys.has('KeyA') || keys.has('ArrowLeft')) moveX -= 1
  if (keys.has('KeyD') || keys.has('ArrowRight')) moveX += 1
  return { moveX, moveZ }
}

/**
 * Returns true once per E key tap or touch interact, then resets.
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
  if (blocked) {
    interactJustPressed = false
    touchMoveX = 0
    touchMoveZ = 0
  }
}

/** Returns whether game input is currently blocked. */
export const isInputBlocked = (): boolean => inputBlocked

/**
 * Sets the movement vector from the virtual joystick.
 * Values should be in [-1, 1].
 * @param x - Horizontal axis
 * @param z - Vertical axis (positive = forward)
 */
export const setTouchMovement = (x: number, z: number): void => {
  touchMoveX = x
  touchMoveZ = z
}

/**
 * Triggers an interact press from a touch button.
 * No-ops when input is blocked.
 */
export const triggerTouchInteract = (): void => {
  if (!inputBlocked) interactJustPressed = true
}
