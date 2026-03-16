import { setInputBlocked } from '../controls/user'
import { hideControls, showControls } from '../hud/controls'
import type { Book } from '../types/hardcover'
import { fetchBookList } from '../utils/api'
import { isTouchDevice } from '../utils/device'

const SHELF_ORDER = ['currently-reading', 'to-read', 'read'] as const

const SHELF_LABELS: Record<string, string> = {
  'currently-reading': 'Currently Reading',
  'to-read': 'Want to Read',
  read: 'Read',
}

const FALLBACK_COLOR = '#3a2a1a'

/**
 * Full-screen overlay displaying the Hardcover book list as a bookcase.
 * Each shelf group sits on its own warm wooden shelf plank.
 * Hover a book to see details. Keyboard: E/Escape to close.
 */
class BookViewer {
  private overlay: HTMLElement
  private body: HTMLElement
  private onClose: (() => void) | null = null
  private cache: Record<string, Book[]> | null = null
  isOpen = false

  constructor() {
    const { overlay, body } = this.buildDOM()
    this.overlay = overlay
    this.body = body
    document.body.appendChild(this.overlay)
    document.addEventListener('keydown', this.handleKey)
  }

  /** Builds the top-level overlay DOM structure. */
  private buildDOM(): { overlay: HTMLElement; body: HTMLElement } {
    const overlay = document.createElement('div')
    overlay.className = 'fixed inset-0 hidden flex-col z-20 bg-[#08060a] font-serif'

    const header = document.createElement('div')
    header.className =
      'flex items-center justify-between px-6 py-3 border-b border-[rgba(175,135,55,0.2)] shrink-0'

    const title = document.createElement('div')
    title.className = 'text-[#9a7040] text-[14px] tracking-[4px] uppercase'
    title.textContent = 'Book List'
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
   * Builds a card element for a single book.
   * @param book - The book data to display
   */
  private buildCard(book: Book): HTMLElement {
    const card = document.createElement('div')
    card.className =
      'relative w-28 flex-shrink-0 cursor-default group hover:-translate-y-2 hover:scale-105 transition-transform duration-200'
    card.style.borderLeft = `3px solid ${FALLBACK_COLOR}`

    if (book.cover_url) {
      const img = document.createElement('img')
      img.src = book.cover_url
      img.alt = book.title
      img.className = 'w-full h-44 object-cover'
      img.loading = 'lazy'
      card.appendChild(img)
    } else {
      const placeholder = document.createElement('div')
      placeholder.className =
        'w-full h-44 flex items-center justify-center bg-[#1a120a] text-[#5a4030] text-[11px] text-center px-2 leading-tight'
      placeholder.textContent = book.title
      card.appendChild(placeholder)
    }

    const footer = document.createElement('div')
    footer.className = 'bg-[#0f0a0e] px-2 py-1.5'

    const titleEl = document.createElement('div')
    titleEl.className = 'text-[#9a7040] text-[13px] tracking-[0.5px] truncate'
    titleEl.textContent = book.title

    const authorEl = document.createElement('div')
    authorEl.className = 'text-[#5a4a30] text-[12px] mt-0.5 truncate'
    authorEl.textContent = book.author

    footer.appendChild(titleEl)
    footer.appendChild(authorEl)

    // Hover overlay
    const hoverEl = document.createElement('div')
    hoverEl.className =
      'absolute inset-0 bg-black/90 p-2 flex flex-col items-center justify-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none'

    const hoverTitle = document.createElement('div')
    hoverTitle.className = 'text-[#9a7040] text-[13px] tracking-[0.5px] leading-tight mb-1'
    hoverTitle.textContent = book.title

    const hoverAuthor = document.createElement('div')
    hoverAuthor.className = 'text-[#7a6a50] text-[12px] tracking-[1px] mb-2'
    hoverAuthor.textContent = book.author

    const rating = book.user_rating ?? book.avg
    const hoverRating = document.createElement('div')
    hoverRating.className = 'text-[#9a7040] text-[14px]'
    hoverRating.textContent = rating != null ? `★ ${rating.toFixed(2)}` : 'No rating'

    hoverEl.appendChild(hoverTitle)
    hoverEl.appendChild(hoverAuthor)
    hoverEl.appendChild(hoverRating)

    if (book.url) {
      const hoverLink = document.createElement('a')
      hoverLink.href = book.url
      hoverLink.target = '_blank'
      hoverLink.rel = 'noopener noreferrer'
      hoverLink.className =
        'text-[#5a7040] text-[12px] tracking-[1px] mt-2 uppercase pointer-events-auto'
      hoverLink.textContent = 'Hardcover ↗'
      hoverEl.appendChild(hoverLink)
    }

    card.appendChild(footer)
    card.appendChild(hoverEl)

    return card
  }

  /** Builds the wooden shelf plank separator between sections. */
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
    el.textContent = 'Failed to load book list.'
    this.body.appendChild(el)
  }

  /**
   * Renders the full book list grouped by shelf.
   * @param data - Map of shelf name to array of books
   */
  private renderData(data: Record<string, Book[]>): void {
    this.body.innerHTML = ''

    for (const shelfKey of SHELF_ORDER) {
      const books = data[shelfKey]
      if (!books || books.length === 0) continue

      let collapsed = false

      const header = document.createElement('div')
      header.className =
        'flex items-center gap-2 text-[#6a5030] text-[13px] tracking-[4px] uppercase mb-4 cursor-pointer select-none hover:text-[#9a7040] transition-colors'

      const chevron = document.createElement('span')
      chevron.className = 'text-[10px] transition-transform duration-200'
      chevron.textContent = '▼'

      const label = document.createElement('span')
      label.textContent = `${SHELF_LABELS[shelfKey]}  (${books.length})`

      header.appendChild(chevron)
      header.appendChild(label)
      this.body.appendChild(header)

      const row = document.createElement('div')
      row.className = 'flex flex-wrap justify-center gap-3 mb-2'
      for (const book of books) row.appendChild(this.buildCard(book))
      this.body.appendChild(row)

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

  private handleKey = (e: KeyboardEvent): void => {
    if (!this.isOpen) return
    if (e.code === 'Escape' || e.code === 'KeyE') {
      e.stopImmediatePropagation()
      this.close()
    }
  }

  /**
   * Opens the book viewer and blocks game input.
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
      fetchBookList()
        .then((data) => {
          this.cache = data
          if (this.isOpen) this.renderData(data)
        })
        .catch(() => {
          if (this.isOpen) this.renderError()
        })
    }
  }

  /** Closes the book viewer, restores game input, and fires the onClose callback. */
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

const viewer = new BookViewer()

/**
 * Opens the in-page book list viewer.
 * @param onClose - Optional callback fired when the viewer is closed
 */
export const openBookViewer = (onClose?: () => void): void => viewer.open(onClose)
