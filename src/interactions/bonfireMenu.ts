import resumePdf from '../assets/resume/christianbjerre-fernandes.pdf?url'
import { Menu, type MenuItem } from './menu'

// Items declared separately so TypeScript can resolve `menu`'s type before the lambdas reference it
const items: MenuItem[] = [
  {
    label: 'Open Resume',
    action: (): void => {
      window.open(resumePdf, '_blank')
    },
  },
  {
    label: 'Rest',
    action: (): void => {
      // Placeholder — will restore health, reset destruction, etc.
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
