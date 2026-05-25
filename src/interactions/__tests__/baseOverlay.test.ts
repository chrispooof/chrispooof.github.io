// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../../controls/user', () => ({
  setInputBlocked: vi.fn(),
}))
vi.mock('../../controls/camera', () => ({
  setOrbitBlocked: vi.fn(),
}))
vi.mock('../../hud/controls', () => ({
  hideControls: vi.fn(),
  showControls: vi.fn(),
}))

import { setOrbitBlocked } from '../../controls/camera'
import { setInputBlocked } from '../../controls/user'
import { hideControls, showControls } from '../../hud/controls'
import { BaseOverlay } from '../baseOverlay'

/** Concrete overlay used to exercise the BaseOverlay lifecycle in tests. */
class TestOverlay extends BaseOverlay {
  renderCalls = 0
  teardownCalls = 0

  constructor(options?: { blocksOrbit?: boolean }) {
    const overlay = document.createElement('div')
    overlay.className = 'hidden'
    super(overlay, options)
  }

  protected override render(): void {
    this.renderCalls += 1
  }

  protected override teardown(): void {
    this.teardownCalls += 1
  }
}

/** Dispatches a keydown event with the given code on document. */
const press = (code: string): void => {
  document.dispatchEvent(new KeyboardEvent('keydown', { code, bubbles: true }))
}

describe('BaseOverlay', () => {
  const created: BaseOverlay[] = []

  /** Tracks an instance so afterEach can detach its document listener. */
  const track = <T extends BaseOverlay>(o: T): T => {
    created.push(o)
    return o
  }

  /** Factory for the standard TestOverlay used by most tests. */
  const makeOverlay = (options?: { blocksOrbit?: boolean }): TestOverlay =>
    track(new TestOverlay(options))

  beforeEach(() => {
    vi.mocked(setInputBlocked).mockClear()
    vi.mocked(setOrbitBlocked).mockClear()
    vi.mocked(hideControls).mockClear()
    vi.mocked(showControls).mockClear()
  })

  afterEach(() => {
    while (created.length > 0) created.pop()!.destroy()
  })

  describe('open()', () => {
    it('marks the overlay as open', () => {
      const o = makeOverlay()
      o.open()
      expect(o.isOpen).toBe(true)
    })

    it('blocks game input', () => {
      const o = makeOverlay()
      o.open()
      expect(setInputBlocked).toHaveBeenCalledWith(true)
    })

    it('hides the HUD controls', () => {
      const o = makeOverlay()
      o.open()
      expect(hideControls).toHaveBeenCalledOnce()
    })

    it('swaps the overlay classes from hidden to flex', () => {
      const o = makeOverlay()
      o.open()
      expect(o['overlay'].classList.contains('hidden')).toBe(false)
      expect(o['overlay'].classList.contains('flex')).toBe(true)
    })

    it('runs the subclass render hook', () => {
      const o = makeOverlay()
      o.open()
      expect(o.renderCalls).toBe(1)
    })

    it('does not block orbit by default', () => {
      const o = makeOverlay()
      o.open()
      expect(setOrbitBlocked).not.toHaveBeenCalled()
    })

    it('blocks orbit when blocksOrbit option is true', () => {
      const o = makeOverlay({ blocksOrbit: true })
      o.open()
      expect(setOrbitBlocked).toHaveBeenCalledWith(true)
    })

    it('is idempotent — second open is a no-op', () => {
      const o = makeOverlay()
      o.open()
      o.open()
      expect(o.renderCalls).toBe(1)
      expect(setInputBlocked).toHaveBeenCalledTimes(1)
    })
  })

  describe('close()', () => {
    it('marks the overlay as closed', () => {
      const o = makeOverlay()
      o.open()
      o.close()
      expect(o.isOpen).toBe(false)
    })

    it('unblocks game input', () => {
      const o = makeOverlay()
      o.open()
      o.close()
      expect(setInputBlocked).toHaveBeenLastCalledWith(false)
    })

    it('shows the HUD controls', () => {
      const o = makeOverlay()
      o.open()
      o.close()
      expect(showControls).toHaveBeenCalledOnce()
    })

    it('swaps the overlay classes from flex to hidden', () => {
      const o = makeOverlay()
      o.open()
      o.close()
      expect(o['overlay'].classList.contains('flex')).toBe(false)
      expect(o['overlay'].classList.contains('hidden')).toBe(true)
    })

    it('runs the subclass teardown hook', () => {
      const o = makeOverlay()
      o.open()
      o.close()
      expect(o.teardownCalls).toBe(1)
    })

    it('unblocks orbit when blocksOrbit was enabled', () => {
      const o = makeOverlay({ blocksOrbit: true })
      o.open()
      o.close()
      expect(setOrbitBlocked).toHaveBeenLastCalledWith(false)
    })

    it('fires the onClose callback exactly once', () => {
      const onClose = vi.fn()
      const o = makeOverlay()
      o.open(onClose)
      o.close()
      expect(onClose).toHaveBeenCalledOnce()
    })

    it('clears onClose so a second close does not fire it again', () => {
      const onClose = vi.fn()
      const o = makeOverlay()
      o.open(onClose)
      o.close()
      o.close()
      expect(onClose).toHaveBeenCalledOnce()
    })

    it('is idempotent — close on already-closed overlay is a no-op', () => {
      const o = makeOverlay()
      o.close()
      expect(o.teardownCalls).toBe(0)
      expect(setInputBlocked).not.toHaveBeenCalled()
    })
  })

  describe('key handler', () => {
    it('closes on Escape when open', () => {
      const o = makeOverlay()
      o.open()
      press('Escape')
      expect(o.isOpen).toBe(false)
    })

    it('closes on KeyE when open', () => {
      const o = makeOverlay()
      o.open()
      press('KeyE')
      expect(o.isOpen).toBe(false)
    })

    it('ignores other keys', () => {
      const o = makeOverlay()
      o.open()
      press('KeyW')
      press('Space')
      expect(o.isOpen).toBe(true)
    })

    it('ignores keys while closed', () => {
      const o = makeOverlay()
      press('Escape')
      expect(o.isOpen).toBe(false)
      expect(o.teardownCalls).toBe(0)
    })
  })

  describe('lifecycle order', () => {
    it('runs render after blocking input', () => {
      const calls: string[] = []
      vi.mocked(setInputBlocked).mockImplementation(() => {
        calls.push('setInputBlocked')
      })
      class OrderingOverlay extends TestOverlay {
        protected override render(): void {
          calls.push('render')
          super.render()
        }
      }
      track(new OrderingOverlay()).open()
      expect(calls).toEqual(['setInputBlocked', 'render'])
    })

    it('runs teardown before unblocking input', () => {
      const calls: string[] = []
      vi.mocked(setInputBlocked).mockImplementation((blocked: boolean) => {
        calls.push(`setInputBlocked(${blocked})`)
      })
      class OrderingOverlay extends TestOverlay {
        protected override teardown(): void {
          calls.push('teardown')
          super.teardown()
        }
      }
      const o = track(new OrderingOverlay())
      o.open()
      calls.length = 0 // ignore open's setInputBlocked(true)
      o.close()
      expect(calls).toEqual(['teardown', 'setInputBlocked(false)'])
    })
  })
})
