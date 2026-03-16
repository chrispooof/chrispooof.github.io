// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

const ALL_KEYS = [
  'KeyW',
  'KeyS',
  'KeyA',
  'KeyD',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'KeyE',
]

const press = (code: string): void => {
  document.dispatchEvent(new KeyboardEvent('keydown', { code, bubbles: true }))
}

const release = (code: string): void => {
  document.dispatchEvent(new KeyboardEvent('keyup', { code, bubbles: true }))
}

describe('user controls', () => {
  let getMovement: () => { moveX: number; moveZ: number }
  let getInteractPressed: () => boolean
  let setInputBlocked: (blocked: boolean) => void
  let isInputBlocked: () => boolean

  // Import once — module registers its listeners at load time.
  // afterEach resets state by releasing keys and clearing flags.
  beforeEach(async () => {
    const mod = await import('../user')
    getMovement = mod.getMovement
    getInteractPressed = mod.getInteractPressed
    setInputBlocked = mod.setInputBlocked
    isInputBlocked = mod.isInputBlocked
  })

  afterEach(() => {
    ALL_KEYS.forEach(release)
    setInputBlocked(false)
    getInteractPressed() // consume any pending press
  })

  describe('input blocking', () => {
    it('is not blocked by default', () => {
      expect(isInputBlocked()).toBe(false)
    })

    it('blocks input', () => {
      setInputBlocked(true)
      expect(isInputBlocked()).toBe(true)
    })

    it('unblocks input', () => {
      setInputBlocked(true)
      setInputBlocked(false)
      expect(isInputBlocked()).toBe(false)
    })

    it('returns zero movement when blocked', () => {
      setInputBlocked(true)
      press('KeyW')
      expect(getMovement()).toEqual({ moveX: 0, moveZ: 0 })
    })
  })

  describe('movement', () => {
    it('returns zero with no keys held', () => {
      expect(getMovement()).toEqual({ moveX: 0, moveZ: 0 })
    })

    it('moves forward on W', () => {
      press('KeyW')
      expect(getMovement().moveZ).toBe(1)
    })

    it('moves backward on S', () => {
      press('KeyS')
      expect(getMovement().moveZ).toBe(-1)
    })

    it('moves left on A', () => {
      press('KeyA')
      expect(getMovement().moveX).toBe(-1)
    })

    it('moves right on D', () => {
      press('KeyD')
      expect(getMovement().moveX).toBe(1)
    })

    it('moves forward on ArrowUp', () => {
      press('ArrowUp')
      expect(getMovement().moveZ).toBe(1)
    })

    it('moves backward on ArrowDown', () => {
      press('ArrowDown')
      expect(getMovement().moveZ).toBe(-1)
    })

    it('moves left on ArrowLeft', () => {
      press('ArrowLeft')
      expect(getMovement().moveX).toBe(-1)
    })

    it('moves right on ArrowRight', () => {
      press('ArrowRight')
      expect(getMovement().moveX).toBe(1)
    })

    it('combines diagonal movement', () => {
      press('KeyW')
      press('KeyD')
      expect(getMovement()).toEqual({ moveX: 1, moveZ: 1 })
    })

    it('clears axis on key release', () => {
      press('KeyW')
      release('KeyW')
      expect(getMovement().moveZ).toBe(0)
    })
  })

  describe('interact', () => {
    it('returns false initially', () => {
      expect(getInteractPressed()).toBe(false)
    })

    it('returns true after E keydown', () => {
      press('KeyE')
      expect(getInteractPressed()).toBe(true)
    })

    it('is consumed after being read once', () => {
      press('KeyE')
      getInteractPressed()
      expect(getInteractPressed()).toBe(false)
    })

    it('does not register E when input is blocked', () => {
      setInputBlocked(true)
      press('KeyE')
      setInputBlocked(false)
      expect(getInteractPressed()).toBe(false)
    })

    it('clears a pending press when input becomes blocked', () => {
      press('KeyE')
      setInputBlocked(true) // should clear the queued press
      setInputBlocked(false)
      expect(getInteractPressed()).toBe(false)
    })
  })
})
