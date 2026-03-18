import { setInputBlocked } from '../controls/user'
import { blockTouchBtn } from '../hud/prompt'
import { setTouchJoystickVisible } from '../hud/touchControls'
import { isTouchDevice } from '../utils/device'

/** A single entry in a navigation menu with a display label and associated action. */
export interface MenuItem {
  label: string
  action: () => void
}

/**
 * Reusable Dark Souls-style menu overlay.
 * Keyboard: W/S or arrows to navigate, E/Enter to confirm, Escape to close.
 * Touch: centered layout, X button to close, tap to highlight and confirm.
 */
export class Menu {
  private container: HTMLElement
  private itemEls: HTMLElement[] = []
  private selectedIndex = 0
  private readonly items: MenuItem[]
  isOpen = false

  /**
   * @param title - Menu header text
   * @param items - List of options with labels and actions
   */
  constructor(title: string, items: MenuItem[]) {
    this.items = items
    this.container = this.buildDOM(title)
    document.body.appendChild(this.container)
    document.addEventListener('keydown', this.handleKey)
  }

  /**
   * Builds the menu DOM structure.
   * @param title - Header label
   */
  private buildDOM(title: string): HTMLElement {
    const container = document.createElement('div')
    container.className = [
      isTouchDevice
        ? 'fixed hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 select-none'
        : 'fixed hidden bottom-[18%] right-[8%] z-10 select-none',
      'min-w-[260px] px-[30px] pt-[22px] pb-[26px]',
      'font-serif',
      'bg-[rgba(8,6,4,0.93)] border border-[rgba(175,135,55,0.3)]',
    ].join(' ')

    const titleRow = document.createElement('div')
    titleRow.className =
      'flex items-center justify-between mb-[18px] pb-[12px] border-b border-[rgba(140,100,40,0.2)]'

    const titleEl = document.createElement('div')
    titleEl.className = 'text-[10px] tracking-[4px] uppercase text-[#6a5030]'
    titleEl.textContent = title
    titleRow.appendChild(titleEl)

    if (isTouchDevice) {
      const closeBtn = document.createElement('button')
      closeBtn.className =
        'flex items-center justify-center w-8 h-8 text-[#6a5030] hover:text-[#9a7040] text-[18px] bg-transparent border-0 cursor-pointer transition-colors'
      closeBtn.textContent = '✕'
      closeBtn.addEventListener('touchend', (e: TouchEvent) => {
        e.preventDefault()
        this.close()
      })
      titleRow.appendChild(closeBtn)
    }

    container.appendChild(titleRow)

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i]
      const row = document.createElement('div')
      row.className = 'flex items-center gap-[10px] py-2 text-[14px] text-[#90806a] cursor-default'

      const cursor = document.createElement('span')
      cursor.textContent = '▶'
      cursor.className = 'text-[8px] w-3 shrink-0 text-[#c8a040] opacity-0'

      const label = document.createElement('span')
      label.textContent = item.label

      row.appendChild(cursor)
      row.appendChild(label)
      row.addEventListener('mouseenter', () => this.select(i))
      row.addEventListener('click', () => this.confirm())

      if (isTouchDevice) {
        row.addEventListener(
          'touchstart',
          (e: TouchEvent) => {
            e.preventDefault()
            this.select(i)
          },
          { passive: false },
        )
        row.addEventListener('touchend', (e: TouchEvent) => {
          e.preventDefault()
          this.confirm()
        })
      }

      container.appendChild(row)
      this.itemEls.push(row)
    }

    return container
  }

  /**
   * Highlights the given item index.
   * @param index - Index of the item to select
   */
  private select(index: number): void {
    const prev = this.itemEls[this.selectedIndex]
    const prevCursor = prev?.firstElementChild as HTMLElement | null
    if (prev) prev.style.color = '#90806a'
    if (prevCursor) prevCursor.style.opacity = '0'

    this.selectedIndex = index

    const next = this.itemEls[index]
    const nextCursor = next?.firstElementChild as HTMLElement | null
    if (next) next.style.color = '#f0d080'
    if (nextCursor) nextCursor.style.opacity = '1'
  }

  /** Handles keyboard navigation within the menu. */
  private handleKey = (e: KeyboardEvent): void => {
    if (!this.isOpen) return
    switch (e.code) {
      case 'ArrowUp':
      case 'KeyW':
        this.select((this.selectedIndex - 1 + this.items.length) % this.items.length)
        break
      case 'ArrowDown':
      case 'KeyS':
        this.select((this.selectedIndex + 1) % this.items.length)
        break
      case 'KeyE':
      case 'Enter':
        this.confirm()
        break
      case 'Escape':
        this.close()
        break
    }
  }

  /** Runs the currently selected item's action. */
  private confirm(): void {
    this.items[this.selectedIndex].action()
  }

  /** Opens the menu and blocks game input. */
  open(): void {
    this.isOpen = true
    this.container.classList.remove('hidden')
    this.container.classList.add('block')
    this.select(0)
    setInputBlocked(true)
    if (isTouchDevice) {
      setTouchJoystickVisible(false)
      blockTouchBtn(true)
    }
  }

  /** Closes the menu and restores game input. */
  close(): void {
    this.isOpen = false
    this.container.classList.remove('block')
    this.container.classList.add('hidden')
    setInputBlocked(false)
    if (isTouchDevice) {
      setTouchJoystickVisible(true)
      blockTouchBtn(false)
    }
  }
}
