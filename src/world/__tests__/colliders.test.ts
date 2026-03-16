import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('colliders', () => {
  let registerCollider: (x: number, z: number, radius: number) => void
  let checkCollision: (x: number, z: number, entityRadius: number) => boolean

  beforeEach(async () => {
    vi.resetModules()
    const mod = await import('../colliders')
    registerCollider = mod.registerCollider
    checkCollision = mod.checkCollision
  })

  it('returns false when no colliders are registered', () => {
    expect(checkCollision(0, 0, 0.3)).toBe(false)
  })

  it('returns false when entity is outside collider radius', () => {
    registerCollider(0, 0, 1)
    expect(checkCollision(5, 0, 0.3)).toBe(false)
  })

  it('returns true when entity overlaps a collider', () => {
    registerCollider(0, 0, 1)
    expect(checkCollision(0.5, 0, 0.3)).toBe(true)
  })

  it('accounts for entity radius when checking overlap', () => {
    registerCollider(0, 0, 0.5)
    // dist=0.7, sum of radii=0.8 → collision
    expect(checkCollision(0.7, 0, 0.3)).toBe(true)
    // dist=0.9, sum of radii=0.8 → no collision
    expect(checkCollision(0.9, 0, 0.3)).toBe(false)
  })

  it('returns true when on the exact boundary edge', () => {
    registerCollider(0, 0, 1)
    // dist=0.99, sum=1.29 → collision; dist=1.31, sum=1.29 → no collision
    expect(checkCollision(0.99, 0, 0.3)).toBe(true)
    expect(checkCollision(1.31, 0, 0.3)).toBe(false)
  })

  it('returns true if any registered collider overlaps', () => {
    registerCollider(10, 10, 1)
    registerCollider(20, 20, 1)
    expect(checkCollision(10.5, 10, 0.3)).toBe(true)
    expect(checkCollision(20.5, 20, 0.3)).toBe(true)
    expect(checkCollision(0, 0, 0.3)).toBe(false)
  })

  it('handles colliders at negative coordinates', () => {
    registerCollider(-5, -5, 1)
    expect(checkCollision(-5, -5, 0.3)).toBe(true)
    expect(checkCollision(0, 0, 0.3)).toBe(false)
  })
})
