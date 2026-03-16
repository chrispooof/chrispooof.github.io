import { PHOTO_ALBUMS } from '../config/photoAlbums'
import { setOrbitBlocked } from '../controls/camera'
import { setInputBlocked } from '../controls/user'
import { hideControls, showControls } from '../hud/controls'
import { isTouchDevice } from '../utils/device'

/** Returns all photo URLs for the given album key. */
const getAlbumUrls = (album: string): string[] => PHOTO_ALBUMS[album] ?? []

/**
 * Full-screen photo gallery overlay.
 * Keyboard: A/← previous, D/→ next, E/Escape close.
 * Touch: swipe left/right to navigate, tap X button to close.
 */
class PhotoViewer {
  private overlay: HTMLElement
  private imgEl!: HTMLImageElement
  private counterEl!: HTMLElement
  private titleEl!: HTMLElement
  private currentIndex = 0
  private currentUrls: string[] = []
  private swipeTouchId: number | null = null
  private swipeStartX = 0
  isOpen = false

  constructor() {
    this.overlay = this.buildDOM()
    document.body.appendChild(this.overlay)
    document.addEventListener('keydown', this.handleKey)
  }

  /** Builds the full-screen overlay DOM. */
  private buildDOM(): HTMLElement {
    const overlay = document.createElement('div')
    overlay.className =
      'fixed inset-0 hidden flex-col items-center justify-center z-20 bg-black/95 font-serif'

    // Close button — always visible on touch, hidden on desktop
    const closeBtn = document.createElement('button')
    closeBtn.className = [
      'absolute top-4 right-4',
      isTouchDevice ? 'flex' : 'hidden',
      'items-center justify-center w-10 h-10',
      'text-[#6a5030] hover:text-[#9a7040] text-[20px]',
      'bg-transparent border-0 cursor-pointer transition-colors',
    ].join(' ')
    closeBtn.textContent = '✕'
    closeBtn.addEventListener('click', () => this.close())
    overlay.appendChild(closeBtn)

    this.titleEl = document.createElement('div')
    this.titleEl.className = 'mb-[14px] text-[#9a7040] text-[12px] tracking-[4px] uppercase'
    overlay.appendChild(this.titleEl)

    this.imgEl = document.createElement('img')
    this.imgEl.className =
      'max-w-[88vw] max-h-[76vh] object-contain border border-[rgba(175,135,55,0.25)]'
    overlay.appendChild(this.imgEl)

    this.counterEl = document.createElement('div')
    this.counterEl.className = 'mt-4 text-[#6a5030] text-[11px] tracking-[3px]'
    overlay.appendChild(this.counterEl)

    const hint = document.createElement('div')
    hint.className = 'absolute bottom-6 text-[#4a3820] text-[11px] tracking-[2px]'
    hint.textContent = isTouchDevice ? 'swipe to navigate' : '← →  navigate    ·    E  close'
    overlay.appendChild(hint)

    // Swipe detection on the image
    this.imgEl.addEventListener(
      'touchstart',
      (e: TouchEvent) => {
        const t = e.changedTouches[0]
        this.swipeTouchId = t.identifier
        this.swipeStartX = t.clientX
      },
      { passive: true },
    )

    this.imgEl.addEventListener(
      'touchend',
      (e: TouchEvent) => {
        for (const t of Array.from(e.changedTouches)) {
          if (t.identifier !== this.swipeTouchId) continue
          const dx = t.clientX - this.swipeStartX
          if (Math.abs(dx) > 40) this.navigate(dx < 0 ? 1 : -1)
          this.swipeTouchId = null
        }
      },
      { passive: true },
    )

    return overlay
  }

  /** Handles keyboard navigation. */
  private handleKey = (e: KeyboardEvent): void => {
    if (!this.isOpen) return
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.navigate(-1)
    else if (e.code === 'ArrowRight' || e.code === 'KeyD') this.navigate(1)
    else if (e.code === 'Escape' || e.code === 'KeyE') this.close()
  }

  /**
   * Advances the current photo by delta.
   * @param delta - +1 for next, -1 for previous
   */
  private navigate(delta: number): void {
    if (this.currentUrls.length === 0) return
    this.currentIndex =
      (this.currentIndex + delta + this.currentUrls.length) % this.currentUrls.length
    this.render()
  }

  /** Updates the displayed image and counter. */
  private render(): void {
    this.imgEl.src = this.currentUrls[this.currentIndex]
    this.counterEl.textContent = `${this.currentIndex + 1}  /  ${this.currentUrls.length}`
  }

  /**
   * Opens the viewer for the given album and blocks game input.
   * @param album - Folder name of the album to display
   * @param title - Display title shown above the photos
   */
  open(album: string, title: string): void {
    this.currentUrls = getAlbumUrls(album)
    if (this.currentUrls.length === 0) return
    this.isOpen = true
    this.currentIndex = 0
    this.titleEl.textContent = title
    this.render()
    this.overlay.classList.remove('hidden')
    this.overlay.classList.add('flex')
    setInputBlocked(true)
    setOrbitBlocked(true)
    hideControls()
  }

  /** Closes the viewer and restores game input. */
  close(): void {
    this.isOpen = false
    this.overlay.classList.remove('flex')
    this.overlay.classList.add('hidden')
    setInputBlocked(false)
    setOrbitBlocked(false)
    showControls()
  }
}

const viewer = new PhotoViewer()

/**
 * Opens the photo gallery overlay for the given album folder.
 * @param album - Folder name under photo-albums/ (e.g. 'eclipse')
 * @param title - Human-readable title displayed above the photos
 */
export const openPhotoViewer = (album: string, title: string): void => viewer.open(album, title)
