import { Euler, Quaternion } from 'three'

const HOVER_DURATION = 2.4

export class AssetInteraction {
  readonly rotation = new Quaternion()
  hovered = false
  reducedMotion = false
  private hoverStartedAt: number | null = null
  private pointer: { id: number; x: number; y: number } | null = null
  private readonly delta = new Quaternion()
  private readonly euler = new Euler(0, 0, 0, 'YXZ')

  get pointerId() { return this.pointer?.id ?? null }

  enter(now: number) {
    if (this.hovered) return false
    this.hovered = true
    if (this.pointer || this.reducedMotion) return false
    this.hoverStartedAt = now
    return true
  }

  leave() { this.hovered = false }

  beginDrag(id: number, x: number, y: number) {
    if (this.pointer) return false
    this.pointer = { id, x, y }
    this.hoverStartedAt = null
    return true
  }

  drag(id: number, x: number, y: number, width: number, height: number) {
    if (!this.pointer || this.pointer.id !== id) return false
    this.rotate((y - this.pointer.y) / Math.max(height, 1) * Math.PI,
      (x - this.pointer.x) / Math.max(width, 1) * Math.PI * 2)
    this.pointer.x = x
    this.pointer.y = y
    return true
  }

  endDrag(id: number) {
    if (this.pointer?.id === id) this.pointer = null
  }

  rotate(pitch: number, yaw: number) {
    this.delta.setFromEuler(this.euler.set(pitch, yaw, 0))
    this.rotation.premultiply(this.delta).normalize()
  }

  reset() {
    this.rotation.identity()
    this.hoverStartedAt = null
  }

  sample(now: number) {
    const elapsed = this.hoverStartedAt === null ? HOVER_DURATION : (now - this.hoverStartedAt) / 1000
    const active = elapsed >= 0 && elapsed < HOVER_DURATION && !this.reducedMotion
    if (!active) {
      this.hoverStartedAt = null
      return { active: false, x: 0, y: 0, yaw: 0, roll: 0 }
    }
    const envelope = (1 - elapsed / HOVER_DURATION) ** 3
    return {
      active,
      x: Math.sin(elapsed * 13) * 0.035 * envelope,
      y: Math.sin(elapsed * 9) * 0.025 * envelope,
      yaw: Math.sin(elapsed * 11) * 0.045 * envelope,
      roll: Math.sin(elapsed * 14) * 0.025 * envelope,
    }
  }
}
