import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('cameraBlockers', () => {
  let registerCameraBlocker: (mesh: object) => void
  let cameraBlockers: object[]

  beforeEach(async () => {
    vi.resetModules()
    const mod = await import('../cameraBlockers')
    registerCameraBlocker = mod.registerCameraBlocker as (mesh: object) => void
    cameraBlockers = mod.cameraBlockers as unknown as object[]
  })

  it('starts with an empty list', () => {
    expect(cameraBlockers.length).toBe(0)
  })

  it('registers a mesh', () => {
    const mesh = {}
    registerCameraBlocker(mesh)
    expect(cameraBlockers).toContain(mesh)
  })

  it('registers multiple meshes', () => {
    const a = {}
    const b = {}
    registerCameraBlocker(a)
    registerCameraBlocker(b)
    expect(cameraBlockers.length).toBe(2)
    expect(cameraBlockers).toContain(a)
    expect(cameraBlockers).toContain(b)
  })

  it('preserves insertion order', () => {
    const a = {}
    const b = {}
    const c = {}
    registerCameraBlocker(a)
    registerCameraBlocker(b)
    registerCameraBlocker(c)
    expect(cameraBlockers[0]).toBe(a)
    expect(cameraBlockers[1]).toBe(b)
    expect(cameraBlockers[2]).toBe(c)
  })
})
