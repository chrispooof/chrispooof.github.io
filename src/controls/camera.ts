import {
  CAMERA_ORBIT_SENSITIVITY,
  CAMERA_PITCH,
  CAMERA_PITCH_MAX,
  CAMERA_PITCH_MIN,
  CAMERA_YAW,
} from '../utils/constants'

let pointerDown = false
let lastX = 0
let lastY = 0
let cameraTouchId: number | null = null
let orbitBlocked = false

/** Prevents camera orbit from responding to input (e.g. while a viewer is open). */
export const setOrbitBlocked = (blocked: boolean): void => {
  orbitBlocked = blocked
  if (blocked) cameraTouchId = null
}

/**
 * Applies a pointer drag delta to the camera yaw and pitch.
 * @param dx - Horizontal drag delta in pixels
 * @param dy - Vertical drag delta in pixels
 */
const onDrag = (dx: number, dy: number): void => {
  CAMERA_YAW.value -= dx * CAMERA_ORBIT_SENSITIVITY
  CAMERA_PITCH.value = Math.max(
    CAMERA_PITCH_MIN,
    Math.min(CAMERA_PITCH_MAX, CAMERA_PITCH.value - dy * CAMERA_ORBIT_SENSITIVITY),
  )
}

document.addEventListener('mousedown', (e: MouseEvent) => {
  if (orbitBlocked) return
  pointerDown = true
  lastX = e.clientX
  lastY = e.clientY
})

document.addEventListener('mouseup', () => {
  pointerDown = false
})

document.addEventListener('mousemove', (e: MouseEvent) => {
  if (!pointerDown) return
  onDrag(e.clientX - lastX, e.clientY - lastY)
  lastX = e.clientX
  lastY = e.clientY
})

// Touch orbit: only claims touches that start on the right half of the screen
// so the left-side joystick never conflicts with camera rotation.
document.addEventListener('touchstart', (e: TouchEvent) => {
  if (orbitBlocked || cameraTouchId !== null) return
  for (const t of Array.from(e.changedTouches)) {
    if (t.clientX >= innerWidth / 2) {
      cameraTouchId = t.identifier
      lastX = t.clientX
      lastY = t.clientY
      break
    }
  }
})

document.addEventListener('touchend', (e: TouchEvent) => {
  for (const t of Array.from(e.changedTouches)) {
    if (t.identifier === cameraTouchId) {
      cameraTouchId = null
    }
  }
})

document.addEventListener('touchmove', (e: TouchEvent) => {
  for (const t of Array.from(e.changedTouches)) {
    if (t.identifier === cameraTouchId) {
      onDrag(t.clientX - lastX, t.clientY - lastY)
      lastX = t.clientX
      lastY = t.clientY
    }
  }
})
