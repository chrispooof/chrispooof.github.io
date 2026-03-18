import { setInputBlocked } from '../controls/user'
import { hideControls, showControls } from '../hud/controls'
import type { MALMangaEntry } from '../types/mal'
import { fetchMangaList } from '../utils/api'
import { isTouchDevice } from '../utils/device'

const STATUS_ORDER = ['reading', 'completed', 'plan_to_read', 'on_hold', 'dropped'] as const

const STATUS_LABELS: Record<string, string> = {
  reading: 'Currently Reading',
  completed: 'Completed',
  plan_to_read: 'Plan to Read',
  on_hold: 'On Hold',
  dropped: 'Dropped',
}

/**
 * Full-screen overlay displaying the MAL manga list as a bookshelf.
 * Each status group sits on its own warm wooden shelf plank.
 * Hover a book to see details. Keyboard: E/Escape to close.
 */
class MangaViewer {
  private overlay: HTMLElement
  private body: HTMLElement
  private onClose: (() => void) | null = null
  private cache: MALMangaEntry[] | null = null
  isOpen = false

  constructor() {
    const { overlay, body } = this.buildDOM()
    this.overlay = overlay
    this.body = body
    document.body.appendChild(this.overlay)
    document.addEventListener('keydown', this.handleKey)
  }

  /** Builds the top-level overlay DOM structure with header and scrollable body. */
  private buildDOM(): { overlay: HTMLElement; body: HTMLElement } {
    const overlay = document.createElement('div')
    overlay.className = 'fixed inset-0 hidden flex-col z-20 bg-[#08060a] font-serif'

    const header = document.createElement('div')
    header.className =
      'flex items-center justify-between px-6 py-3 border-b border-[rgba(175,135,55,0.2)] shrink-0'

    const title = document.createElement('div')
    title.className = 'text-[#9a7040] text-[14px] tracking-[4px] uppercase'
    title.textContent = 'Manga List'
    header.appendChild(title)

    const closeBtn = document.createElement('button')
    closeBtn.className = isTouchDevice
      ? 'flex items-center justify-center w-10 h-10 text-[#6a5030] hover:text-[#9a7040] text-[20px] bg-transparent border-0 cursor-pointer transition-colors'
      : 'text-[#6a5030] hover:text-[#9a7040] text-[14px] tracking-[2px] bg-transparent border-0 cursor-pointer transition-colors'
    closeBtn.textContent = isTouchDevice ? '✕' : '[ E ]  close'
    closeBtn.addEventListener('click', () => this.close())
    header.appendChild(closeBtn)

    overlay.appendChild(header)

    const body = document.createElement('div')
    body.className = 'flex-1 overflow-y-auto px-6 py-6'
    overlay.appendChild(body)

    return { overlay, body }
  }

  /**
   * Builds a card element for a single manga entry.
   * @param entry - The manga entry data to display
   */
  private buildCard(entry: MALMangaEntry): HTMLElement {
    const card = document.createElement('div')
    card.className =
      'relative w-28 flex-shrink-0 cursor-pointer group hover:-translate-y-2 hover:scale-105 transition-transform duration-200'
    // Left border as book spine color
    card.style.borderLeft = `3px solid ${entry.node.color ?? '#888'}`

    const img = document.createElement('img')
    img.src = entry.node.main_picture.large
    img.alt = entry.node.title
    img.className = 'w-full h-44 object-cover'
    img.loading = 'lazy'

    const footer = document.createElement('div')
    footer.className = 'bg-[#0f0a0e] px-2 py-1.5'

    const titleEl = document.createElement('div')
    titleEl.className = 'text-[#9a7040] text-[13px] tracking-[0.5px] truncate'
    titleEl.textContent = entry.node.title

    const details = document.createElement('div')
    details.className = 'text-[#5a4a30] text-[12px] mt-0.5'
    const chaps = entry.node.num_chapters === 0 ? '?' : entry.node.num_chapters
    details.textContent = `${entry.list_status.num_chapters_read}/${chaps}ch  ★${entry.list_status.score || '-'}`

    footer.appendChild(titleEl)
    footer.appendChild(details)

    // Hover overlay
    const hoverEl = document.createElement('div')
    hoverEl.className =
      'absolute inset-0 bg-black/90 p-2 flex flex-col items-center justify-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none'

    const hoverTitle = document.createElement('div')
    hoverTitle.className = 'text-[#9a7040] text-[13px] tracking-[0.5px] leading-tight mb-2'
    hoverTitle.textContent = entry.node.title

    const hoverStatus = document.createElement('div')
    hoverStatus.className = 'text-[#7a6a50] text-[12px] tracking-[1px] uppercase mb-1'
    hoverStatus.textContent = STATUS_LABELS[entry.list_status.status] ?? ''

    const hoverScore = document.createElement('div')
    hoverScore.className = 'text-[#9a7040] text-[14px] mt-1'
    hoverScore.textContent =
      entry.list_status.score > 0 ? `★ ${entry.list_status.score}/10` : 'Unscored'

    const hoverVols = document.createElement('div')
    hoverVols.className = 'text-[#5a4a30] text-[12px] mt-1'
    const vols = entry.node.num_volumes === 0 ? '?' : entry.node.num_volumes
    hoverVols.textContent = `${entry.list_status.num_volumes_read}/${vols} vol`

    const hoverLink = document.createElement('a')
    hoverLink.href = `https://myanimelist.net/manga/${entry.node.id}`
    hoverLink.target = '_blank'
    hoverLink.rel = 'noopener noreferrer'
    hoverLink.className =
      'text-[#5a7040] text-[12px] tracking-[1px] mt-2 uppercase pointer-events-auto'
    hoverLink.textContent = 'MAL ↗'

    hoverEl.appendChild(hoverTitle)
    hoverEl.appendChild(hoverStatus)
    hoverEl.appendChild(hoverScore)
    hoverEl.appendChild(hoverVols)
    hoverEl.appendChild(hoverLink)

    card.appendChild(img)
    card.appendChild(footer)
    card.appendChild(hoverEl)

    return card
  }

  /** Builds the wooden shelf plank separator displayed under each status section. */
  private buildShelf(): HTMLElement {
    const shelf = document.createElement('div')
    shelf.className = 'w-full h-3 rounded mb-8'
    shelf.style.background = 'linear-gradient(180deg, #4a3010 0%, #2a1a06 100%)'
    shelf.style.boxShadow = '0 4px 12px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,200,100,0.08)'
    return shelf
  }

  /** Renders a loading indicator into the body. */
  private renderLoading(): void {
    this.body.innerHTML = ''
    const el = document.createElement('div')
    el.className =
      'flex items-center justify-center h-32 text-[#6a5030] text-[14px] tracking-[4px] uppercase'
    el.textContent = 'Loading...'
    this.body.appendChild(el)
  }

  /** Renders an error message into the body. */
  private renderError(): void {
    this.body.innerHTML = ''
    const el = document.createElement('div')
    el.className = 'flex items-center justify-center h-32 text-[#6a2020] text-[12px] tracking-[2px]'
    el.textContent = 'Failed to load manga list.'
    this.body.appendChild(el)
  }

  /**
   * Renders the full manga list grouped by reading status.
   * @param data - The list of manga entries to display
   */
  private renderData(data: MALMangaEntry[]): void {
    this.body.innerHTML = ''

    for (const status of STATUS_ORDER) {
      const entries = data.filter((e) => e.list_status.status === status)
      if (entries.length === 0) continue

      let collapsed = false

      const header = document.createElement('div')
      header.className =
        'flex items-center gap-2 text-[#6a5030] text-[13px] tracking-[4px] uppercase mb-4 cursor-pointer select-none hover:text-[#9a7040] transition-colors'

      const chevron = document.createElement('span')
      chevron.className = 'text-[10px] transition-transform duration-200'
      chevron.textContent = '▼'

      const label = document.createElement('span')
      label.textContent = `${STATUS_LABELS[status]}  (${entries.length})`

      header.appendChild(chevron)
      header.appendChild(label)
      this.body.appendChild(header)

      const row = document.createElement('div')
      row.className = 'flex flex-wrap justify-center gap-3 mb-2'
      for (const entry of entries) row.appendChild(this.buildCard(entry))
      this.body.appendChild(row)

      // Wooden shelf plank under each section
      const shelf = this.buildShelf()
      this.body.appendChild(shelf)

      header.addEventListener('click', () => {
        collapsed = !collapsed
        row.style.display = collapsed ? 'none' : ''
        shelf.style.display = collapsed ? 'none' : ''
        chevron.style.transform = collapsed ? 'rotate(-90deg)' : ''
      })
    }
  }

  /** Handles keyboard shortcuts for closing the viewer. */
  private handleKey = (e: KeyboardEvent): void => {
    if (!this.isOpen) return
    if (e.code === 'Escape' || e.code === 'KeyE') {
      e.stopImmediatePropagation()
      this.close()
    }
  }

  /**
   * Opens the manga viewer and blocks game input.
   * Fetches data on first open and caches it for subsequent opens.
   * @param onClose - Optional callback fired when the viewer is closed
   */
  open(onClose?: () => void): void {
    this.onClose = onClose ?? null
    this.isOpen = true
    this.overlay.classList.remove('hidden')
    this.overlay.classList.add('flex')
    setInputBlocked(true)
    hideControls()

    if (this.cache !== null) {
      this.renderData(this.cache)
    } else {
      this.renderLoading()
      fetchMangaList()
        .then((data) => {
          this.cache = data
          if (this.isOpen) this.renderData(data)
        })
        .catch(() => {
          if (this.isOpen) this.renderError()
        })
    }
  }

  /** Closes the manga viewer, restores game input, and fires the onClose callback. */
  close(): void {
    this.isOpen = false
    this.overlay.classList.remove('flex')
    this.overlay.classList.add('hidden')
    setInputBlocked(false)
    showControls()
    this.onClose?.()
    this.onClose = null
  }
}

const viewer = new MangaViewer()

/**
 * Opens the in-page manga list viewer.
 * @param onClose - Optional callback fired when the viewer is closed
 */
export const openMangaViewer = (onClose?: () => void): void => viewer.open(onClose)
