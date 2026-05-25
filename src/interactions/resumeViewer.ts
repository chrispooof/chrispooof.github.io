import resumePdf from '../assets/resume/christianbjerre-fernandes.pdf?url'
import { isTouchDevice } from '../utils/device'
import { BaseOverlay } from './baseOverlay'

/**
 * Full-screen in-page resume viewer using an iframe (desktop) or external link (mobile).
 * Keyboard: E/Escape to close.
 */
class ResumeViewer extends BaseOverlay {
  constructor() {
    const { overlay, closeBtn } = ResumeViewer.buildDOM()
    super(overlay)
    closeBtn.addEventListener('click', () => this.close())
  }

  /** Builds the overlay DOM: header with close button, and either an iframe or a mobile link. */
  private static buildDOM(): { overlay: HTMLElement; closeBtn: HTMLElement } {
    const overlay = document.createElement('div')
    overlay.className = 'fixed inset-0 hidden flex-col z-20 bg-black/95 font-serif'

    const header = document.createElement('div')
    header.className =
      'flex items-center justify-between px-6 py-3 border-b border-[rgba(175,135,55,0.2)]'

    const title = document.createElement('div')
    title.className = 'text-[#9a7040] text-[11px] tracking-[4px] uppercase'
    title.textContent = 'Resume'
    header.appendChild(title)

    const closeBtn = document.createElement('button')
    closeBtn.className = isTouchDevice
      ? 'flex items-center justify-center w-10 h-10 text-[#6a5030] hover:text-[#9a7040] text-[20px] bg-transparent border-0 cursor-pointer transition-colors'
      : 'text-[#6a5030] hover:text-[#9a7040] text-[11px] tracking-[2px] bg-transparent border-0 cursor-pointer transition-colors'
    closeBtn.textContent = isTouchDevice ? '✕' : '[ E ]  close'
    header.appendChild(closeBtn)

    overlay.appendChild(header)

    if (isTouchDevice) {
      // On mobile, iframes render PDFs at full print width — open natively instead
      const body = document.createElement('div')
      body.className = 'flex-1 flex flex-col items-center justify-center gap-6 px-8'

      const msg = document.createElement('div')
      msg.className = 'text-[#6a5030] text-[12px] tracking-[3px] uppercase text-center'
      msg.textContent = 'PDF preview unavailable on mobile'
      body.appendChild(msg)

      const link = document.createElement('a')
      link.href = resumePdf
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.className = [
        'px-6 py-3 border border-[rgba(175,135,55,0.4)]',
        'text-[#9a7040] text-[13px] tracking-[3px] uppercase',
        'hover:border-[rgba(175,135,55,0.8)] hover:text-[#c8a060] transition-colors',
      ].join(' ')
      link.textContent = 'Open Resume ↗'
      body.appendChild(link)

      overlay.appendChild(body)
    } else {
      const iframe = document.createElement('iframe')
      iframe.src = resumePdf
      iframe.className = 'flex-1 w-full border-0'
      overlay.appendChild(iframe)
    }

    return { overlay, closeBtn }
  }
}

const viewer = new ResumeViewer()

/**
 * Opens the in-page resume viewer.
 * @param onClose - Optional callback fired when the viewer is closed
 */
export const openResumeViewer = (onClose?: () => void): void => viewer.open(onClose)
