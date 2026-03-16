const el = document.createElement('div')

Object.assign(el.style, {
  position: 'fixed',
  color: 'rgba(200, 175, 110, 0.92)',
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: '13px',
  letterSpacing: '2px',
  pointerEvents: 'none',
  textShadow: '0 1px 6px rgba(0,0,0,1), 0 0 12px rgba(0,0,0,0.8)',
  display: 'none',
  transform: 'translate(-50%, -50%)',
  whiteSpace: 'nowrap',
  textAlign: 'center',
})

document.body.appendChild(el)

/**
 * Shows the interaction prompt near a world-projected screen position.
 * @param label - Description of what E will do
 * @param screenX - CSS pixel X (centre of the label)
 * @param screenY - CSS pixel Y (centre of the label)
 */
export const showPrompt = (label: string, screenX: number, screenY: number): void => {
  el.textContent = `[ E ]   ${label}`
  el.style.left = `${screenX}px`
  el.style.top = `${screenY}px`
  el.style.display = 'block'
}

/** Hides the interaction prompt. */
export const hidePrompt = (): void => {
  el.style.display = 'none'
}
