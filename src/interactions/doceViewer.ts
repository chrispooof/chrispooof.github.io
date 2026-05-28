import redeemGift from '../assets/doce/Redeem a Gift Flow.mp4?url'
import sendingGift from '../assets/doce/Sending a Gift Flow.mp4?url'
import signingUp from '../assets/doce/Signing Up Flow.mp4?url'
import { isTouchDevice } from '../utils/device'
import { BaseOverlay } from './baseOverlay'

interface DoceTab {
  label: string
  src: string
}

const TABS: DoceTab[] = [
  { label: 'Signing Up', src: signingUp },
  { label: 'Sending a Gift', src: sendingGift },
  { label: 'Redeem a Gift', src: redeemGift },
]

const DESCRIPTION = [
  `Doce is a gift-sending, react native mobile app I helped build as Founding Engineer on a team of 3. Although we made the tough decision to shut down the project, when it was active, people used it as a more thoughtful way to send gifts to friends and family from local businesses around the DMV area.`,
  `My contributions included working across the stack, but mostly handled majority of the backend architecture and development in AWS as well as developing frontend features and user experience flows.`,
  `Below are some flows to showcase how the app looked and walk through signing up, sending a gift, and redeeming one.`,
]

const TAB_ACTIVE_CLASSES =
  'text-[#9a7040] border-[rgba(175,135,55,0.6)] hover:text-[#c8a060] transition-colors'
const TAB_INACTIVE_CLASSES =
  'text-[#6a5030] border-[rgba(175,135,55,0.2)] hover:text-[#9a7040] transition-colors'
const TAB_BASE_CLASSES =
  'px-4 py-2 text-[12px] tracking-[3px] uppercase bg-transparent border cursor-pointer'

/**
 * Full-screen overlay showcasing the Doce project: description text plus three video tabs
 * (Signing Up, Sending a Gift, Redeem a Gift), each playing with native controls.
 * Keyboard: E/Escape to close.
 */
class DoceViewer extends BaseOverlay {
  private readonly videoEl: HTMLVideoElement
  private readonly tabButtons: HTMLButtonElement[]

  constructor() {
    const { overlay, videoEl, tabButtons, closeBtn } = DoceViewer.buildDOM()
    super(overlay)
    this.videoEl = videoEl
    this.tabButtons = tabButtons
    closeBtn.addEventListener('click', () => this.close())
    for (let i = 0; i < tabButtons.length; i++) {
      const index = i
      tabButtons[i].addEventListener('click', () => this.switchTab(index))
    }
  }

  /** Builds the overlay DOM (header, description, tab row, video) and returns the refs needed. */
  private static buildDOM(): {
    overlay: HTMLElement
    videoEl: HTMLVideoElement
    tabButtons: HTMLButtonElement[]
    closeBtn: HTMLElement
  } {
    const overlay = document.createElement('div')
    overlay.className = 'fixed inset-0 hidden flex-col z-20 bg-black/95 font-serif'

    // Header
    const header = document.createElement('div')
    header.className =
      'flex items-center justify-between px-6 py-3 border-b border-[rgba(175,135,55,0.2)]'

    const title = document.createElement('div')
    title.className = 'text-[#9a7040] text-[11px] tracking-[4px] uppercase'
    title.textContent = 'Doce'
    header.appendChild(title)

    const closeBtn = document.createElement('button')
    closeBtn.className = isTouchDevice
      ? 'flex items-center justify-center w-10 h-10 text-[#6a5030] hover:text-[#9a7040] text-[20px] bg-transparent border-0 cursor-pointer transition-colors'
      : 'text-[#6a5030] hover:text-[#9a7040] text-lg tracking-[2px] bg-transparent border-0 cursor-pointer transition-colors'
    closeBtn.textContent = isTouchDevice ? '✕' : '[ E ]  close'
    header.appendChild(closeBtn)

    overlay.appendChild(header)

    // Body
    const body = document.createElement('div')
    body.className = 'flex-1 overflow-y-auto px-8 py-8 flex flex-col items-center'

    const content = document.createElement('div')
    content.className = 'max-w-3xl w-full flex flex-col items-center'

    const projectTitle = document.createElement('h1')
    projectTitle.className = 'text-[#9a7040] text-2xl tracking-[3px] uppercase mb-2 text-center'
    projectTitle.textContent = 'Doce'
    content.appendChild(projectTitle)

    const role = document.createElement('div')
    role.className = 'text-[#6a5030] text-[11px] tracking-[4px] uppercase mb-6 text-center'
    role.textContent = 'Founding Engineer'
    content.appendChild(role)

    for (const text of DESCRIPTION) {
      const p = document.createElement('p')
      p.className =
        'text-[#7a6a50] text-base leading-relaxed tracking-[0.5px] mb-4 text-justify max-w-2xl'
      p.textContent = text
      content.appendChild(p)
    }

    // Tab row
    const tabRow = document.createElement('div')
    tabRow.className = 'flex flex-wrap justify-center gap-3 mt-6 mb-4'
    const tabButtons: HTMLButtonElement[] = []
    for (const tab of TABS) {
      const btn = document.createElement('button')
      btn.className = `${TAB_BASE_CLASSES} ${TAB_INACTIVE_CLASSES}`
      btn.textContent = tab.label
      tabRow.appendChild(btn)
      tabButtons.push(btn)
    }
    content.appendChild(tabRow)

    // Video
    const videoEl = document.createElement('video')
    videoEl.className =
      'max-w-[85vw] max-h-[60vh] object-contain border border-[rgba(175,135,55,0.25)]'
    videoEl.controls = true
    videoEl.playsInline = true
    videoEl.preload = 'metadata'
    content.appendChild(videoEl)

    body.appendChild(content)
    overlay.appendChild(body)

    return { overlay, videoEl, tabButtons, closeBtn }
  }

  /** Switches the active tab: pauses current video, loads the new src, re-styles tab buttons. */
  private switchTab(index: number): void {
    this.videoEl.pause()
    this.videoEl.src = TABS[index].src
    for (let i = 0; i < this.tabButtons.length; i++) {
      const classes = i === index ? TAB_ACTIVE_CLASSES : TAB_INACTIVE_CLASSES
      this.tabButtons[i].className = `${TAB_BASE_CLASSES} ${classes}`
    }
  }

  /** Resets to the first tab on every open so a returning user sees the onboarding flow first. */
  protected override render(): void {
    this.switchTab(0)
  }

  /** Pauses the video on close so playback doesn't continue while the overlay is hidden. */
  protected override teardown(): void {
    this.videoEl.pause()
  }
}

const viewer = new DoceViewer()

/**
 * Opens the in-page Doce project showcase.
 * @param onClose - Optional callback fired when the viewer is closed
 */
export const openDoceViewer = (onClose?: () => void): void => viewer.open(onClose)
