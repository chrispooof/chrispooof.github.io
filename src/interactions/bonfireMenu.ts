import { openAboutViewer } from './aboutViewer'
import { Menu, type MenuItem } from './menu'
import { openResumeViewer } from './resumeViewer'

// Items declared separately so TypeScript can resolve `menu`'s type before the lambdas reference it
const items: MenuItem[] = [
  {
    label: 'About Me',
    action: (): void => {
      menu.close()
      openAboutViewer(() => menu.open())
    },
  },
  {
    label: 'View Resume',
    action: (): void => {
      menu.close()
      openResumeViewer(() => menu.open())
    },
  },
  {
    label: 'Leave',
    action: (): void => {
      menu.close()
    },
  },
]

const menu = new Menu('Bonfire', items)

/** Opens the bonfire interaction menu. */
export const openBonfireMenu = (): void => menu.open()
