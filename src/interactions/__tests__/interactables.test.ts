import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Interactable } from '../interactables'

const makeInteractable = (x: number, z: number, radius: number): Interactable => ({
  x,
  y: 0,
  z,
  radius,
  label: 'test',
  onInteract: () => {},
})

describe('interactables', () => {
  let registerInteractable: (i: Interactable) => void
  let updateNearby: (px: number, pz: number) => void
  let getNearby: () => Interactable | null

  beforeEach(async () => {
    vi.resetModules()
    const mod = await import('../interactables')
    registerInteractable = mod.registerInteractable
    updateNearby = mod.updateNearby
    getNearby = mod.getNearby
  })

  it('returns null before any update', () => {
    expect(getNearby()).toBeNull()
  })

  it('returns null when no interactables are registered', () => {
    updateNearby(0, 0)
    expect(getNearby()).toBeNull()
  })

  it('returns the interactable when player is within radius', () => {
    const i = makeInteractable(0, 0, 2)
    registerInteractable(i)
    updateNearby(1, 0)
    expect(getNearby()).toBe(i)
  })

  it('returns null when player is outside radius', () => {
    registerInteractable(makeInteractable(0, 0, 2))
    updateNearby(5, 0)
    expect(getNearby()).toBeNull()
  })

  it('returns null when exactly on the radius boundary', () => {
    registerInteractable(makeInteractable(0, 0, 2))
    updateNearby(2, 0)
    expect(getNearby()).toBeNull()
  })

  it('returns the correct interactable among multiple registered', () => {
    const a = makeInteractable(0, 0, 2)
    const b = makeInteractable(10, 10, 2)
    registerInteractable(a)
    registerInteractable(b)
    updateNearby(0.5, 0)
    expect(getNearby()).toBe(a)
    updateNearby(10.5, 10)
    expect(getNearby()).toBe(b)
  })

  it('clears nearby when player moves out of range', () => {
    registerInteractable(makeInteractable(0, 0, 2))
    updateNearby(1, 0)
    expect(getNearby()).not.toBeNull()
    updateNearby(5, 0)
    expect(getNearby()).toBeNull()
  })

  it('uses xz distance only, ignoring y', () => {
    const i = makeInteractable(0, 0, 2)
    registerInteractable(i)
    // player at same xz but different y — should still be in range
    updateNearby(0, 0)
    expect(getNearby()).toBe(i)
  })
})
