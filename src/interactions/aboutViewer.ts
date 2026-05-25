import { isTouchDevice } from '../utils/device'
import { BaseOverlay } from './baseOverlay'

const PARAGRAPHS = [
  `Hello! My name is Christian Bjerre-Fernandes. I studied Computer Science at the University of Chicago and graduated in 2021. I love to study languages and learn about other cultures. I took Japanese and Norwegian during college and continue to study Japanese even now.`,
  `I am currently a Senior Associate Software Engineer at Capital One with an AWS Solutions Architect certification. I work as a full-stack developer and data engineer on Capital One's Slingshot SaaS product.`,
  `Outside of work, I love to play RPGs like Elden Ring and other souls-like games in addition to battle royales like Apex Legends (I main Horizon). I love watching movies (The Prestige, Lincoln Lawyer, etc.) and shows of all kinds (Bojack Horseman, Love is Blind, etc.), photography, and reading all sorts of things (manga, comics, fiction, etc.). I'm also very active and enjoy pickleball, biking, volleyball, and running.`,
]

/**
 * Full-screen overlay displaying the about me blurb.
 * Keyboard: E/Escape to close.
 */
class AboutViewer extends BaseOverlay {
  constructor() {
    const { overlay, closeBtn } = AboutViewer.buildDOM()
    super(overlay)
    closeBtn.addEventListener('click', () => this.close())
  }

  /** Builds the full-screen overlay DOM including header, bio paragraphs, and divider. */
  private static buildDOM(): { overlay: HTMLElement; closeBtn: HTMLElement } {
    const overlay = document.createElement('div')
    overlay.className = 'fixed inset-0 hidden flex-col z-20 bg-black/95 font-serif'

    const header = document.createElement('div')
    header.className =
      'flex items-center justify-between px-6 py-3 border-b border-[rgba(175,135,55,0.2)]'

    const title = document.createElement('div')
    title.className = 'text-[#9a7040] text-[11px] tracking-[4px] uppercase'
    title.textContent = 'About'
    header.appendChild(title)

    const closeBtn = document.createElement('button')
    closeBtn.className = isTouchDevice
      ? 'flex items-center justify-center w-10 h-10 text-[#6a5030] hover:text-[#9a7040] text-[20px] bg-transparent border-0 cursor-pointer transition-colors'
      : 'text-[#6a5030] hover:text-[#9a7040] text-lg tracking-[2px] bg-transparent border-0 cursor-pointer transition-colors'
    closeBtn.textContent = isTouchDevice ? '✕' : '[ E ]  close'
    header.appendChild(closeBtn)

    overlay.appendChild(header)

    const body = document.createElement('div')
    body.className = 'flex-1 overflow-y-auto px-8 py-12 flex justify-center items-start'

    const content = document.createElement('div')
    content.className = 'max-w-2xl w-full'

    const name = document.createElement('h1')
    name.className = 'text-[#9a7040] text-2xl tracking-[3px] uppercase mb-8 text-center'
    name.textContent = 'Christian Bjerre-Fernandes'
    content.appendChild(name)

    for (const text of PARAGRAPHS) {
      const p = document.createElement('p')
      p.className = 'text-[#7a6a50] text-base leading-relaxed tracking-[0.5px] mb-6 text-justify'
      p.textContent = text
      content.appendChild(p)
    }

    const divider = document.createElement('div')
    divider.className = 'border-t border-[rgba(175,135,55,0.15)] mt-8'
    content.appendChild(divider)

    body.appendChild(content)
    overlay.appendChild(body)

    return { overlay, closeBtn }
  }
}

const viewer = new AboutViewer()

/**
 * Opens the in-page about viewer.
 * @param onClose - Optional callback fired when the viewer is closed
 */
export const openAboutViewer = (onClose?: () => void): void => viewer.open(onClose)
