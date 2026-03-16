import { setInputBlocked } from '../controls/user'

export interface MenuItem {
  label: string
  action: () => void
}

/**
 * Reusable Dark Souls-style menu overlay.
 * Keyboard: W/S or arrows to navigate, E/Enter to confirm, Escape to close.
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
    Object.assign(container.style, {
      position: 'fixed',
      bottom: '18%',
      right: '8%',
      minWidth: '260px',
      background: 'rgba(8, 6, 4, 0.93)',
      border: '1px solid rgba(175, 135, 55, 0.3)',
      padding: '22px 30px 26px',
      fontFamily: "Georgia, 'Times New Roman', serif",
      display: 'none',
      userSelect: 'none',
      zIndex: '10',
    })

    const titleEl = document.createElement('div')
    Object.assign(titleEl.style, {
      fontSize: '10px',
      letterSpacing: '4px',
      color: '#6a5030',
      textTransform: 'uppercase',
      marginBottom: '18px',
      paddingBottom: '12px',
      borderBottom: '1px solid rgba(140, 100, 40, 0.2)',
    })
    titleEl.textContent = title
    container.appendChild(titleEl)

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i]
      const row = document.createElement('div')
      Object.assign(row.style, {
        fontSize: '14px',
        padding: '8px 0',
        color: '#90806a',
        cursor: 'default',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      })

      const cursor = document.createElement('span')
      cursor.textContent = '▶'
      Object.assign(cursor.style, {
        fontSize: '8px',
        width: '12px',
        color: '#c8a040',
        opacity: '0',
        flexShrink: '0',
      })

      const label = document.createElement('span')
      label.textContent = item.label

      row.appendChild(cursor)
      row.appendChild(label)
      row.addEventListener('mouseenter', () => this.select(i))
      row.addEventListener('click', () => this.confirm())

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
    this.container.style.display = 'block'
    this.select(0)
    setInputBlocked(true)
  }

  /** Closes the menu and restores game input. */
  close(): void {
    this.isOpen = false
    this.container.style.display = 'none'
    setInputBlocked(false)
  }
}
