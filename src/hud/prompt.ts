import { triggerTouchInteract } from '../controls/user'
import { isTouchDevice } from '../utils/device'

/**
 * Manages the world-projected interaction prompt and optional touch interact button.
 * The prompt is displayed near a world-space object when the player is in range.
 */
class Prompt {
  private readonly el: HTMLElement
  private touchBtn: HTMLElement | null = null
  private touchBtnBlocked = false

  constructor() {
    this.el = this.buildLabel()
    document.body.appendChild(this.el)
    if (isTouchDevice) {
      this.touchBtn = this.buildTouchBtn()
      document.body.appendChild(this.touchBtn)
    }
  }

  /** Builds the prompt label element. */
  private buildLabel(): HTMLElement {
    const el = document.createElement('div')
    el.className = [
      'fixed hidden pointer-events-none',
      '-translate-x-1/2 -translate-y-1/2',
      'whitespace-nowrap text-center',
      'font-serif text-[13px] tracking-[2px]',
      'text-[rgba(200,175,110,0.92)]',
      '[text-shadow:0_1px_6px_rgba(0,0,0,1),0_0_12px_rgba(0,0,0,0.8)]',
    ].join(' ')
    return el
  }

  /** Builds the touch interact button element. */
  private buildTouchBtn(): HTMLElement {
    const btn = document.createElement('button')
    btn.className = [
      'fixed bottom-10 left-1/2 -translate-x-1/2 z-10',
      'hidden items-center justify-center',
      'w-16 h-16 rounded-full',
      'bg-black/40 border border-[rgba(175,135,55,0.35)]',
      'text-[#9a7040] font-serif text-[15px] tracking-[2px] uppercase',
      'touch-none select-none',
    ].join(' ')
    btn.textContent = 'E'
    btn.addEventListener('touchstart', (e: TouchEvent) => {
      e.preventDefault()
      e.stopPropagation()
      triggerTouchInteract()
    })
    return btn
  }

  /**
   * Prevents the touch interact button from appearing while a menu is open.
   * @param blocked - Whether to block the touch button
   */
  blockTouchBtn(blocked: boolean): void {
    this.touchBtnBlocked = blocked
    if (blocked && this.touchBtn) {
      this.touchBtn.classList.remove('flex')
      this.touchBtn.classList.add('hidden')
    }
  }

  /**
   * Shows the interaction prompt near a world-projected screen position.
   * On touch devices also shows the bottom-center interact button.
   * @param label - Description of what E / tap will do
   * @param screenX - CSS pixel X (centre of the label)
   * @param screenY - CSS pixel Y (centre of the label)
   */
  show(label: string, screenX: number, screenY: number): void {
    this.el.textContent = `[ E ]   ${label}`
    this.el.style.left = `${screenX}px`
    this.el.style.top = `${screenY}px`
    this.el.classList.remove('hidden')
    this.el.classList.add('block')
    if (this.touchBtn && !this.touchBtnBlocked) {
      this.touchBtn.classList.remove('hidden')
      this.touchBtn.classList.add('flex')
    }
  }

  /** Hides the interaction prompt and touch button. */
  hide(): void {
    this.el.classList.remove('block')
    this.el.classList.add('hidden')
    if (this.touchBtn) {
      this.touchBtn.classList.remove('flex')
      this.touchBtn.classList.add('hidden')
    }
  }
}

const prompt = new Prompt()

/** Prevents the touch interact button from appearing while a menu is open. */
export const blockTouchBtn = (blocked: boolean): void => prompt.blockTouchBtn(blocked)

/**
 * Shows the interaction prompt near a world-projected screen position.
 * On touch devices also shows the bottom-center interact button.
 * @param label - Description of what E / tap will do
 * @param screenX - CSS pixel X (centre of the label)
 * @param screenY - CSS pixel Y (centre of the label)
 */
export const showPrompt = (label: string, screenX: number, screenY: number): void =>
  prompt.show(label, screenX, screenY)

/** Hides the interaction prompt and touch button. */
export const hidePrompt = (): void => prompt.hide()
