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
  el.classList.remove('hidden')
  el.classList.add('block')
}

/** Hides the interaction prompt. */
export const hidePrompt = (): void => {
  el.classList.remove('block')
  el.classList.add('hidden')
}
