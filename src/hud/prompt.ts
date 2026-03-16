import { triggerTouchInteract } from '../controls/user'
import { isTouchDevice } from '../utils/device'

// World-projected prompt label
const el = document.createElement('div')
el.className = [
  'fixed hidden pointer-events-none',
  '-translate-x-1/2 -translate-y-1/2',
  'whitespace-nowrap text-center',
  'font-serif text-[13px] tracking-[2px]',
  'text-[rgba(200,175,110,0.92)]',
  '[text-shadow:0_1px_6px_rgba(0,0,0,1),0_0_12px_rgba(0,0,0,0.8)]',
].join(' ')
document.body.appendChild(el)

// When true, showPrompt will not reveal the touch interact button
let touchBtnBlocked = false

/** Prevents the touch interact button from appearing while a menu is open. */
export const blockTouchBtn = (blocked: boolean): void => {
  touchBtnBlocked = blocked
  if (blocked && touchBtn) {
    touchBtn.classList.remove('flex')
    touchBtn.classList.add('hidden')
  }
}

// Touch interact button — fixed bottom-center, visible alongside the prompt
let touchBtn: HTMLElement | null = null
if (isTouchDevice) {
  touchBtn = document.createElement('button')
  touchBtn.className = [
    'fixed bottom-10 left-1/2 -translate-x-1/2 z-10',
    'hidden items-center justify-center',
    'w-16 h-16 rounded-full',
    'bg-black/40 border border-[rgba(175,135,55,0.35)]',
    'text-[#9a7040] font-serif text-[15px] tracking-[2px] uppercase',
    'touch-none select-none',
  ].join(' ')
  touchBtn.textContent = 'E'
  touchBtn.addEventListener('touchstart', (e: TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    triggerTouchInteract()
  })
  document.body.appendChild(touchBtn)
}

/**
 * Shows the interaction prompt near a world-projected screen position.
 * On touch devices also shows the bottom-center interact button.
 * @param label - Description of what E / tap will do
 * @param screenX - CSS pixel X (centre of the label)
 * @param screenY - CSS pixel Y (centre of the label)
 */
export const showPrompt = (label: string, screenX: number, screenY: number): void => {
  el.textContent = `[ E ]   ${label}`
  el.style.left = `${screenX}px`
  el.style.top = `${screenY}px`
  el.classList.remove('hidden')
  el.classList.add('block')
  if (touchBtn && !touchBtnBlocked) {
    touchBtn.classList.remove('hidden')
    touchBtn.classList.add('flex')
  }
}

/** Hides the interaction prompt and touch button. */
export const hidePrompt = (): void => {
  el.classList.remove('block')
  el.classList.add('hidden')
  if (touchBtn) {
    touchBtn.classList.remove('flex')
    touchBtn.classList.add('hidden')
  }
}
