import { setOrbitBlocked } from '../controls/camera'
import { setInputBlocked } from '../controls/user'
import { hideControls, showControls } from '../hud/controls'

/**
 * Shared lifecycle for full-screen overlay viewers (about, resume, book, anime, manga, photo).
 *
 * Owns the open/close ritual every viewer used to repeat: block game input, hide HUD controls,
 * optionally block camera orbit, listen for E/Escape, fire an onClose callback. Subclasses build
 * the overlay element, pass it to super(), and override render()/teardown() for content work.
 */
export abstract class BaseOverlay {
  protected readonly overlay: HTMLElement
  private readonly blocksOrbit: boolean
  protected onCloseCb: (() => void) | null = null
  isOpen = false

  /**
   * @param overlay - The fully-built overlay DOM element; should start with the `hidden` class
   * @param options.blocksOrbit - When true, also disables camera orbit while open (default false)
   */
  protected constructor(overlay: HTMLElement, options: { blocksOrbit?: boolean } = {}) {
    this.overlay = overlay
    this.blocksOrbit = options.blocksOrbit ?? false
    document.body.appendChild(this.overlay)
    document.addEventListener('keydown', this.onKeyDown)
  }

  /**
   * Stable arrow wrapper for the keydown listener. Delegates to handleKey() so subclasses can
   * override handleKey as a regular method without the listener pointing at the base version.
   */
  private readonly onKeyDown = (e: KeyboardEvent): void => this.handleKey(e)

  /** Default key handler: close on Escape or E. Override to add navigation keys. */
  protected handleKey(e: KeyboardEvent): void {
    if (!this.isOpen) return
    if (e.code === 'Escape' || e.code === 'KeyE') {
      e.stopImmediatePropagation()
      this.close()
    }
  }

  /** Hook run inside open() after input is blocked and the overlay is shown. No-op by default. */
  protected render(): void {}

  /** Hook run inside close() before input is restored and the overlay is hidden. No-op by default. */
  protected teardown(): void {}

  /**
   * Opens the overlay: shows the DOM, blocks input, hides HUD controls, optionally blocks orbit,
   * then runs render(). Idempotent — re-opening while already open is a no-op (prevents double
   * onClose registration which would orphan the previous caller's callback).
   * @param onClose - Optional callback fired once when this overlay closes
   */
  open(onClose?: () => void): void {
    if (this.isOpen) return
    this.onCloseCb = onClose ?? null
    this.isOpen = true
    this.overlay.classList.remove('hidden')
    this.overlay.classList.add('flex')
    setInputBlocked(true)
    if (this.blocksOrbit) setOrbitBlocked(true)
    hideControls()
    this.render()
  }

  /**
   * Closes the overlay: runs teardown(), hides the DOM, restores input + HUD controls + orbit,
   * fires the onClose callback exactly once. Idempotent.
   */
  close(): void {
    if (!this.isOpen) return
    this.teardown()
    this.isOpen = false
    this.overlay.classList.remove('flex')
    this.overlay.classList.add('hidden')
    setInputBlocked(false)
    if (this.blocksOrbit) setOrbitBlocked(false)
    showControls()
    const cb = this.onCloseCb
    this.onCloseCb = null
    cb?.()
  }

  /**
   * Removes the document listener and detaches the overlay element. Intended for tests and
   * hot-module-reload — production viewers are module-level singletons that live for the page.
   */
  destroy(): void {
    if (this.isOpen) this.close()
    document.removeEventListener('keydown', this.onKeyDown)
    this.overlay.remove()
  }
}
