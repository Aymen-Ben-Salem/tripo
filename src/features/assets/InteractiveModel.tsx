import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Group, PerspectiveCamera, type Object3D } from 'three'
import { AssetInteraction } from './assetInteraction'
import { fitModelCamera, getRotationRadius } from './modelFraming'

export function InteractiveModel({ model }: { model: Object3D }) {
  const interactionRef = useRef(new AssetInteraction())
  const motion = useRef<Group>(null)
  const rotation = useRef<Group>(null)
  const get = useThree((state) => state.get)
  const invalidate = useThree((state) => state.invalidate)
  const size = useThree((state) => state.size)
  const radius = useMemo(() => getRotationRadius(model), [model])

  useLayoutEffect(() => {
    const camera = get().camera
    if (camera instanceof PerspectiveCamera) fitModelCamera(camera, radius, size.width / Math.max(size.height, 1))
    invalidate()
  }, [get, invalidate, radius, size.width, size.height])

  const updateCursor = () => {
    const interaction = interactionRef.current
    const canvas = get().gl.domElement
    canvas.style.cursor = interaction.pointerId !== null ? 'grabbing' : interaction.hovered ? 'grab' : ''
  }

  useEffect(() => {
    const interaction = interactionRef.current
    const canvas = get().gl.domElement
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => { interaction.reducedMotion = preference.matches; invalidate() }
    updatePreference()
    preference.addEventListener('change', updatePreference)
    canvas.tabIndex = 0
    canvas.setAttribute('aria-label', '3D speaker. Drag to rotate, or use the arrow keys. Press Home to reset.')
    const markKeyboardFocus = (event: KeyboardEvent) => {
      if (event.key === 'Tab') canvas.dataset.keyboardFocus = 'true'
    }
    const clearKeyboardFocus = () => { delete canvas.dataset.keyboardFocus }

    const move = (event: PointerEvent) => {
      if (interaction.drag(event.pointerId, event.clientX, event.clientY, canvas.clientWidth, canvas.clientHeight)) invalidate()
    }
    const end = (event: PointerEvent) => {
      interaction.endDrag(event.pointerId)
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
      canvas.style.cursor = interaction.hovered ? 'grab' : ''
    }
    const leave = () => {
      interaction.leave()
      if (interaction.pointerId === null) canvas.style.cursor = ''
    }
    const cancel = () => {
      const id = interaction.pointerId
      if (id !== null) {
        interaction.endDrag(id)
        if (canvas.hasPointerCapture(id)) canvas.releasePointerCapture(id)
      }
      interaction.leave()
      canvas.style.cursor = ''
    }
    const keydown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return
      const step = Math.PI / 18
      switch (event.key) {
        case 'ArrowLeft': interaction.rotate(0, -step); break
        case 'ArrowRight': interaction.rotate(0, step); break
        case 'ArrowUp': interaction.rotate(-step, 0); break
        case 'ArrowDown': interaction.rotate(step, 0); break
        case 'Home': interaction.reset(); break
        default: return
      }
      event.preventDefault()
      canvas.dataset.keyboardFocus = 'true'
      invalidate()
    }
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerup', end)
    canvas.addEventListener('pointercancel', end)
    canvas.addEventListener('lostpointercapture', end)
    canvas.addEventListener('pointerleave', leave)
    canvas.addEventListener('keydown', keydown)
    canvas.addEventListener('pointerdown', clearKeyboardFocus)
    canvas.addEventListener('blur', clearKeyboardFocus)
    document.addEventListener('keydown', markKeyboardFocus, true)
    window.addEventListener('blur', cancel)
    return () => {
      preference.removeEventListener('change', updatePreference)
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerup', end)
      canvas.removeEventListener('pointercancel', end)
      canvas.removeEventListener('lostpointercapture', end)
      canvas.removeEventListener('pointerleave', leave)
      canvas.removeEventListener('keydown', keydown)
      canvas.removeEventListener('pointerdown', clearKeyboardFocus)
      canvas.removeEventListener('blur', clearKeyboardFocus)
      document.removeEventListener('keydown', markKeyboardFocus, true)
      window.removeEventListener('blur', cancel)
      cancel()
      canvas.removeAttribute('tabindex')
      canvas.removeAttribute('aria-label')
      clearKeyboardFocus()
    }
  }, [get, invalidate])

  useFrame((_, delta) => {
    const interaction = interactionRef.current
    if (!motion.current || !rotation.current) return
    const sample = interaction.sample(performance.now())
    motion.current.position.set(sample.x, sample.y, 0)
    motion.current.rotation.set(0, sample.yaw, sample.roll)
    const remaining = rotation.current.quaternion.angleTo(interaction.rotation)
    if (interaction.reducedMotion || remaining < 0.0001) rotation.current.quaternion.copy(interaction.rotation)
    else rotation.current.quaternion.slerp(interaction.rotation, 1 - Math.exp(-18 * Math.min(delta, 0.05)))
    if (sample.active || remaining >= 0.0001) invalidate()
  })

  const enter = (event: ThreeEvent<PointerEvent>) => {
    const interaction = interactionRef.current
    event.stopPropagation()
    if (event.pointerType !== 'touch' && interaction.enter(performance.now())) invalidate()
    updateCursor()
  }
  const leave = () => { interactionRef.current.leave(); updateCursor() }
  const down = (event: ThreeEvent<PointerEvent>) => {
    const interaction = interactionRef.current
    const canvas = get().gl.domElement
    if (event.button !== 0 || !event.isPrimary) return
    event.stopPropagation()
    if (!interaction.beginDrag(event.pointerId, event.clientX, event.clientY)) return
    canvas.setPointerCapture(event.pointerId)
    canvas.focus({ preventScroll: true })
    updateCursor()
    invalidate()
  }

  return (
    <>
      <group ref={motion}>
        <group ref={rotation}><primitive object={model} dispose={null} /></group>
      </group>
      {/* A stable hit area prevents the moving surface from retriggering hover. */}
      <mesh onPointerOver={enter} onPointerOut={leave} onPointerDown={down}>
        <sphereGeometry args={[1.62, 24, 16]} />
        <meshBasicMaterial colorWrite={false} depthWrite={false} />
      </mesh>
    </>
  )
}
