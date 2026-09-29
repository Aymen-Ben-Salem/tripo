import assert from 'node:assert/strict'
import test from 'node:test'
import { Quaternion } from 'three'
import { AssetInteraction } from '../src/features/assets/assetInteraction.ts'

test('hover settles and cannot replay until the pointer leaves', () => {
  const interaction = new AssetInteraction()
  assert.equal(interaction.enter(0), true)
  assert.notEqual(interaction.sample(150).x, 0)
  assert.equal(interaction.enter(800), false)
  assert.equal(interaction.sample(2400).active, false)
  assert.equal(interaction.sample(2400).x, 0)
  assert.equal(interaction.enter(4000), false)
  interaction.leave()
  assert.equal(interaction.enter(4100), true)
  assert.equal(interaction.sample(4250).active, true)
})

test('hover movement stays subtle and finishes at the resting pose', () => {
  const interaction = new AssetInteraction()
  interaction.enter(0)
  for (let time = 0; time < 2400; time += 16) {
    const pose = interaction.sample(time)
    assert(Math.abs(pose.x) <= 0.035)
    assert(Math.abs(pose.y) <= 0.025)
    assert(Math.abs(pose.yaw) <= 0.045)
    assert(Math.abs(pose.roll) <= 0.025)
  }
  const rest = interaction.sample(3000)
  assert.equal(Math.abs(rest.x) + Math.abs(rest.y) + Math.abs(rest.yaw) + Math.abs(rest.roll), 0)
})

test('drag takes over from hover and retains its orientation after release', () => {
  const interaction = new AssetInteraction()
  interaction.enter(0)
  assert.equal(interaction.beginDrag(1, 100, 100), true)
  assert.equal(interaction.sample(200).active, false)
  assert.equal(interaction.drag(1, 300, 150, 800, 600), true)
  assert(interaction.rotation.angleTo(new Quaternion()) > 0.5)
  const orientation = interaction.rotation.clone()
  interaction.endDrag(1)
  assert.equal(interaction.pointerId, null)
  assert.equal(interaction.drag(1, 500, 500, 800, 600), false)
  assert(interaction.rotation.equals(orientation))
  assert.equal(interaction.enter(500), false)
})

test('a second pointer cannot take over or end an active drag', () => {
  const interaction = new AssetInteraction()
  interaction.beginDrag(1, 0, 0)
  assert.equal(interaction.beginDrag(2, 0, 0), false)
  assert.equal(interaction.drag(2, 100, 100, 800, 600), false)
  interaction.endDrag(2)
  assert.equal(interaction.pointerId, 1)
  interaction.endDrag(1)
  assert.equal(interaction.pointerId, null)
})

test('crossing the hover boundary during a captured drag does not interrupt rotation or restart the nudge', () => {
  const interaction = new AssetInteraction()
  interaction.enter(0)
  interaction.beginDrag(1, 0, 0)
  interaction.leave()
  assert.equal(interaction.drag(1, 150, 20, 800, 600), true)
  assert.equal(interaction.enter(100), false)
  interaction.endDrag(1)
  assert.equal(interaction.sample(200).active, false)
  assert.equal(interaction.enter(300), false)
  interaction.leave()
  assert.equal(interaction.enter(400), true)
})

test('reduced motion suppresses hover but keeps manual rotation', () => {
  const interaction = new AssetInteraction()
  interaction.reducedMotion = true
  assert.equal(interaction.enter(0), false)
  assert.equal(interaction.sample(100).active, false)
  interaction.beginDrag(1, 0, 0)
  interaction.drag(1, 100, 50, 800, 600)
  assert(interaction.rotation.angleTo(new Quaternion()) > 0)
})

test('changing motion preference stops an active hover', () => {
  const interaction = new AssetInteraction()
  interaction.enter(0)
  interaction.reducedMotion = true
  assert.equal(interaction.sample(100).active, false)
  interaction.reducedMotion = false
  assert.equal(interaction.sample(200).active, false)
})

test('keyboard rotation can reset without restarting hover', () => {
  const interaction = new AssetInteraction()
  interaction.enter(0)
  interaction.rotate(0.2, 0.3)
  interaction.reset()
  assert(interaction.rotation.equals(new Quaternion()))
  assert.equal(interaction.sample(100).active, false)
  assert.equal(interaction.enter(200), false)
})
