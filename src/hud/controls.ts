const hud = document.createElement('div')

hud.className =
  'fixed bottom-5 left-1/2 -translate-x-1/2 text-white/70 font-sans text-[13px] pointer-events-none text-center'
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
hud.textContent = isTouchDevice
  ? 'Joystick to move  ·  Drag to orbit'
  : 'WASD / Arrow keys to move  ·  Mouse drag to orbit'

document.body.appendChild(hud)

/** Hides the movement controls HUD. */
export const hideControls = (): void => {
  hud.style.display = 'none'
}

/** Shows the movement controls HUD. */
export const showControls = (): void => {
  hud.style.display = ''
}
