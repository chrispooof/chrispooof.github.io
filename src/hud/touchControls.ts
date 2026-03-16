import { setTouchMovement } from '../controls/user'
import { isTouchDevice } from '../utils/device'

let joystickBase: HTMLElement | null = null

/** Shows or hides the virtual joystick (call when menus open/close). */
export const setTouchJoystickVisible = (visible: boolean): void => {
  if (joystickBase) joystickBase.style.display = visible ? '' : 'none'
}

if (isTouchDevice) {
  const KNOB_TRAVEL = 40 // max px the knob moves from center

  // Outer ring
  const base = document.createElement('div')
  joystickBase = base
  base.className = [
    'fixed bottom-10 left-10 z-10',
    'w-32 h-32 rounded-full',
    'bg-black/30 border border-[rgba(175,135,55,0.2)]',
    'touch-none select-none',
  ].join(' ')

  // Inner knob
  const knob = document.createElement('div')
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

  let touchId: number | null = null
  let baseCX = 0
  let baseCY = 0

  const moveKnob = (cx: number, cy: number): void => {
    const dx = cx - baseCX
    const dy = cy - baseCY
    const dist = Math.hypot(dx, dy)
    const clamped = Math.min(dist, KNOB_TRAVEL)
    const nx = dist > 0 ? dx / dist : 0
    const ny = dist > 0 ? dy / dist : 0
    knob.style.transform = `translate(calc(-50% + ${nx * clamped}px), calc(-50% + ${ny * clamped}px))`
    const intensity = Math.min(dist / KNOB_TRAVEL, 1)
    setTouchMovement(nx * intensity, -ny * intensity) // invert Y: drag up = move forward
  }

  const resetKnob = (): void => {
    knob.style.transform = 'translate(-50%, -50%)'
    setTouchMovement(0, 0)
  }

  base.addEventListener('touchstart', (e: TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (touchId !== null) return
    const t = e.changedTouches[0]
    touchId = t.identifier
    const rect = base.getBoundingClientRect()
    baseCX = rect.left + rect.width / 2
    baseCY = rect.top + rect.height / 2
    moveKnob(t.clientX, t.clientY)
  })

  document.addEventListener(
    'touchmove',
    (e: TouchEvent) => {
      if (touchId === null) return
      for (const t of Array.from(e.changedTouches)) {
        if (t.identifier === touchId) {
          e.preventDefault()
          moveKnob(t.clientX, t.clientY)
        }
      }
    },
    { passive: false },
  )

  document.addEventListener('touchend', (e: TouchEvent) => {
    for (const t of Array.from(e.changedTouches)) {
      if (t.identifier === touchId) {
        touchId = null
        resetKnob()
      }
    }
  })

  document.addEventListener('touchcancel', (e: TouchEvent) => {
    for (const t of Array.from(e.changedTouches)) {
      if (t.identifier === touchId) {
        touchId = null
        resetKnob()
      }
    }
  })
}
