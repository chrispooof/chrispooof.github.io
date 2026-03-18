import { isTouchDevice } from '../utils/device'

/**
 * Dark Souls-style intro screen.
 * A radial vignette reveals the 3D scene through a circular window in the centre.
 * The rest of the screen is black with the title above and prompt below.
 */
class StartScreen {
  private overlay: HTMLElement
  private onStart: (() => void) | null = null

  constructor() {
    this.overlay = this.buildDOM()
    document.body.appendChild(this.overlay)
  }

  /**
   * Builds the DOM for the start screen.
   * @returns The start screen DOM element.
   */
  private buildDOM(): HTMLElement {
    const overlay = document.createElement('div')
    overlay.className = 'fixed inset-0 z-30 font-serif cursor-pointer select-none'
    // Radial gradient: transparent circle in the centre fades to solid black at the edges
    overlay.style.background =
      'radial-gradient(circle at 50% 52%, transparent 0%, transparent 25%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.95) 42%, #000 54%)'

    // Title — floats above the circle in the solid black region
    const header = document.createElement('div')
    header.className = 'absolute top-[11%] left-0 right-0 flex flex-col items-center gap-2'

    const title = document.createElement('div')
    title.className =
      'text-[#9a7040] text-lg tracking-wider sm:tracking-[10px] uppercase text-center px-4'
    title.textContent = 'Christian Bjerre-Fernandes'
    header.appendChild(title)

    const subtitle = document.createElement('div')
    subtitle.className = 'text-[#9a7040] text-xs tracking-[6px] uppercase'
    subtitle.textContent = 'Portfolio'
    header.appendChild(subtitle)

    overlay.appendChild(header)

    // Prompt — sits below the circle in the solid black region
    const prompt = document.createElement('div')
    prompt.className =
      'absolute bottom-[10%] left-0 right-0 text-center text-[#9a7040] text-sm tracking-wider animate-pulse'
    prompt.textContent = isTouchDevice ? '[ Tap to begin ]' : '[ Press any key to begin ]'
    overlay.appendChild(prompt)

    return overlay
  }

  /**
   * Shows the start screen and fires the callback when the user interacts.
   * @param onStart - Called once when the user presses a key or clicks
   */
  show(onStart: () => void): void {
    this.onStart = onStart
    this.overlay.classList.remove('hidden')

    const trigger = (): void => {
      document.removeEventListener('keydown', trigger)
      this.overlay.removeEventListener('click', trigger)
      this.hide()
      this.onStart?.()
      this.onStart = null
    }

    document.addEventListener('keydown', trigger, { once: true })
    this.overlay.addEventListener('click', trigger, { once: true })
  }

  /**
   * Hides the start screen.
   */
  hide(): void {
    this.overlay.classList.add('hidden')
  }
}

const startScreen = new StartScreen()

/**
 * Shows the intro start screen.
 * @param onStart - Fired once when the player presses any key or clicks
 */
export const showStartScreen = (onStart: () => void): void => startScreen.show(onStart)
