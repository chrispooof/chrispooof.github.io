import { setTouchMovement } from '../controls/user'
import { isTouchDevice } from '../utils/device'

const KNOB_TRAVEL = 40

/**
 * Virtual on-screen joystick controller for touch devices.
 * Creates and manages DOM elements and touch event handlers for the joystick.
 */
class TouchControls {
  private base: HTMLElement | null = null
  private knob: HTMLElement | null = null
  private touchId: number | null = null
  private baseCX = 0
  private baseCY = 0

  constructor() {
    if (!isTouchDevice) return
    this.init()
  }

  /**
   * Shows or hides the virtual joystick (call when menus open/close).
   * @param visible - Whether the joystick should be visible
   */
  setJoystickVisible(visible: boolean): void {
    if (this.base) this.base.style.display = visible ? '' : 'none'
  }

  /**
   * Moves the joystick knob to reflect the current touch position
   * and sets the movement vector accordingly.
   * @param cx - Current touch clientX
   * @param cy - Current touch clientY
   */
  private moveKnob(cx: number, cy: number): void {
    const dx = cx - this.baseCX
    const dy = cy - this.baseCY
    const dist = Math.hypot(dx, dy)
    const clamped = Math.min(dist, KNOB_TRAVEL)
    const nx = dist > 0 ? dx / dist : 0
    const ny = dist > 0 ? dy / dist : 0
    this.knob!.style.transform = `translate(calc(-50% + ${nx * clamped}px), calc(-50% + ${ny * clamped}px))`
    const intensity = Math.min(dist / KNOB_TRAVEL, 1)
    setTouchMovement(nx * intensity, -ny * intensity) // invert Y: drag up = move forward
  }

  /** Resets the knob to center and clears movement input. */
  private resetKnob(): void {
    this.knob!.style.transform = 'translate(-50%, -50%)'
    setTouchMovement(0, 0)
  }

  /** Initializes the joystick DOM structure and attaches touch event listeners. */
  private init(): void {
    const base = document.createElement('div')
    this.base = base
    base.className = [
      'fixed bottom-10 left-10 z-10',
      'w-32 h-32 rounded-full',
      'bg-black/30 border border-[rgba(175,135,55,0.2)]',
      'touch-none select-none',
    ].join(' ')

    const knob = document.createElement('div')
    this.knob = knob
    knob.className = [
      'absolute w-12 h-12 rounded-full',
      'bg-[rgba(175,135,55,0.12)] border border-[rgba(175,135,55,0.35)]',
      'transition-none',
    ].join(' ')
    knob.style.left = '50%'
    knob.style.top = '50%'
    knob.style.transform = 'translate(-50%, -50%)'

    base.appendChild(knob)
    document.body.appendChild(base)

    base.addEventListener('touchstart', (e: TouchEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (this.touchId !== null) return
      const t = e.changedTouches[0]
      this.touchId = t.identifier
      const rect = base.getBoundingClientRect()
      this.baseCX = rect.left + rect.width / 2
      this.baseCY = rect.top + rect.height / 2
      this.moveKnob(t.clientX, t.clientY)
    })

    document.addEventListener(
      'touchmove',
      (e: TouchEvent) => {
        if (this.touchId === null) return
        for (const t of Array.from(e.changedTouches)) {
          if (t.identifier === this.touchId) {
            e.preventDefault()
            this.moveKnob(t.clientX, t.clientY)
          }
        }
      },
      { passive: false },
    )

    document.addEventListener('touchend', (e: TouchEvent) => {
      for (const t of Array.from(e.changedTouches)) {
        if (t.identifier === this.touchId) {
          this.touchId = null
          this.resetKnob()
        }
      }
    })

    document.addEventListener('touchcancel', (e: TouchEvent) => {
      for (const t of Array.from(e.changedTouches)) {
        if (t.identifier === this.touchId) {
          this.touchId = null
          this.resetKnob()
        }
      }
    })
  }
}

const touchControls = new TouchControls()

/** Shows or hides the virtual joystick (call when menus open/close). */
export const setTouchJoystickVisible = (visible: boolean): void =>
  touchControls.setJoystickVisible(visible)
