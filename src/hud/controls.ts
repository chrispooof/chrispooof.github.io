import { isTouchDevice } from '../utils/device'

/**
 * Manages the movement controls hint displayed at the bottom of the screen.
 */
class Controls {
  private readonly hud: HTMLElement

  constructor() {
    this.hud = document.createElement('div')
    this.hud.className =
      'fixed bottom-5 left-1/2 -translate-x-1/2 text-white/70 font-sans text-[13px] pointer-events-none text-center'
    this.hud.textContent = isTouchDevice
      ? 'Joystick to move  ·  Drag to orbit'
      : 'WASD / Arrow keys to move  ·  Mouse drag to orbit'
    document.body.appendChild(this.hud)
  }

  /** Hides the movement controls HUD. */
  hide(): void {
    this.hud.style.display = 'none'
  }

  /** Shows the movement controls HUD. */
  show(): void {
    this.hud.style.display = ''
  }
}

const controls = new Controls()

/** Hides the movement controls HUD. */
export const hideControls = (): void => controls.hide()

/** Shows the movement controls HUD. */
export const showControls = (): void => controls.show()
