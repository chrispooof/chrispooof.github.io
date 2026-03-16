/** True when the primary input is touch (mobile / tablet). */
export const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
