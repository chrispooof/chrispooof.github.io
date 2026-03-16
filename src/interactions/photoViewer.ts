import { setInputBlocked } from '../controls/user'
import { hideControls, showControls } from '../hud/controls'

const photoModules = import.meta.glob('/src/assets/photo-albums/**/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

/**
 * Returns all photo URLs whose path contains the given album folder name.
 * @param album - Folder name to filter by (e.g. 'eclipse', 'japan')
 */
const getAlbumUrls = (album: string): string[] =>
  Object.entries(photoModules)
    .filter(([path]) => path.includes(`/photo-albums/${album}/`))
    .map(([, url]) => url)

/**
 * Full-screen photo gallery overlay.
 * Keyboard: A/← previous, D/→ next, E/Escape close.
 */
class PhotoViewer {
  private overlay: HTMLElement
  private imgEl!: HTMLImageElement
  private counterEl!: HTMLElement
  private titleEl!: HTMLElement
  private currentIndex = 0
  private currentUrls: string[] = []
  isOpen = false

  constructor() {
    this.overlay = this.buildDOM()
    document.body.appendChild(this.overlay)
    document.addEventListener('keydown', this.handleKey)
  }

  /** Builds the full-screen overlay DOM. */
  private buildDOM(): HTMLElement {
    const overlay = document.createElement('div')
    overlay.className = 'fixed inset-0 hidden flex-col items-center justify-center z-20 bg-black/95 font-serif'

    this.titleEl = document.createElement('div')
    this.titleEl.className = 'mb-[14px] text-[#9a7040] text-[12px] tracking-[4px] uppercase'
    overlay.appendChild(this.titleEl)

    this.imgEl = document.createElement('img')
    this.imgEl.className = 'max-w-[88vw] max-h-[76vh] object-contain border border-[rgba(175,135,55,0.25)]'
    overlay.appendChild(this.imgEl)

    this.counterEl = document.createElement('div')
    this.counterEl.className = 'mt-4 text-[#6a5030] text-[11px] tracking-[3px]'
    overlay.appendChild(this.counterEl)

    const hint = document.createElement('div')
    hint.className = 'absolute bottom-6 text-[#4a3820] text-[11px] tracking-[2px]'
    hint.textContent = '← →  navigate    ·    E  close'
    overlay.appendChild(hint)

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
    this.currentIndex = (this.currentIndex + delta + this.currentUrls.length) % this.currentUrls.length
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
    hideControls()
  }

  /** Closes the viewer and restores game input. */
  close(): void {
    this.isOpen = false
    this.overlay.classList.remove('flex')
    this.overlay.classList.add('hidden')
    setInputBlocked(false)
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
