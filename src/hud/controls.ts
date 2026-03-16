const hud = document.createElement('div')

Object.assign(hud.style, {
  position: 'fixed',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  color: 'rgba(255,255,255,0.7)',
  fontFamily: 'sans-serif',
  fontSize: '13px',
  pointerEvents: 'none',
  textShadow: '0 1px 3px rgba(0,0,0,0.8)',
  textAlign: 'center',
})

hud.textContent = 'WASD / Arrow keys to move  ·  Mouse drag to orbit'

document.body.appendChild(hud)

/** Hides the movement controls HUD. */
export const hideControls = (): void => { hud.style.display = 'none' }

/** Shows the movement controls HUD. */
export const showControls = (): void => { hud.style.display = 'block' }
