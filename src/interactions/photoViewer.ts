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
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      background: 'rgba(0, 0, 0, 0.96)',
      display: 'none',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '20',
      fontFamily: "Georgia, 'Times New Roman', serif",
    })

    this.titleEl = document.createElement('div')
    Object.assign(this.titleEl.style, {
      marginBottom: '14px',
      color: '#9a7040',
      fontSize: '12px',
      letterSpacing: '4px',
      textTransform: 'uppercase',
    })
    overlay.appendChild(this.titleEl)

    this.imgEl = document.createElement('img')
    Object.assign(this.imgEl.style, {
      maxWidth: '88vw',
      maxHeight: '76vh',
      objectFit: 'contain',
      border: '1px solid rgba(175, 135, 55, 0.25)',
    })
    overlay.appendChild(this.imgEl)

    this.counterEl = document.createElement('div')
    Object.assign(this.counterEl.style, {
      marginTop: '16px',
      color: '#6a5030',
      fontSize: '11px',
      letterSpacing: '3px',
    })
    overlay.appendChild(this.counterEl)

    const hint = document.createElement('div')
    Object.assign(hint.style, {
      position: 'absolute',
      bottom: '24px',
      color: '#4a3820',
      fontSize: '11px',
      letterSpacing: '2px',
    })
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
    this.overlay.style.display = 'flex'
    setInputBlocked(true)
    hideControls()
  }

  /** Closes the viewer and restores game input. */
  close(): void {
    this.isOpen = false
    this.overlay.style.display = 'none'
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
