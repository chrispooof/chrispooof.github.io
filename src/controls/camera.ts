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

document.addEventListener('touchstart', (e: TouchEvent) => {
  const t = e.touches[0]
  pointerDown = true
  lastX = t.clientX
  lastY = t.clientY
})

document.addEventListener('touchend', () => {
  pointerDown = false
})

document.addEventListener('touchmove', (e: TouchEvent) => {
  if (!pointerDown) return
  const t = e.touches[0]
  onDrag(t.clientX - lastX, t.clientY - lastY)
  lastX = t.clientX
  lastY = t.clientY
})
