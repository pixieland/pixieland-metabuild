import * as THREE from 'three'
import { useRef, useCallback, useState } from 'react'
import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import { Center, Text, Text3D } from '@react-three/drei'
import { Bloom, EffectComposer, LUT } from '@react-three/postprocessing'
import { LUTCubeLoader } from 'postprocessing'
import { Beam } from './prism/Beam'
import { Rainbow } from './prism/Rainbow'
import { Prism } from './prism/Prism'
import { Flare } from './prism/Flare'
import { Box } from './prism/Box'
import { calculateRefractionAngle, lerp, lerpV3 } from '../util'

export default function DynamicPrism({ title }) {
  const texture = useLoader(LUTCubeLoader, '/lut/F-6800-STD.cube')
  return (
    <Canvas orthographic gl={{ antialias: false }} camera={{ position: [0, 0, 100], zoom: 70 }}>
      <color attach="background" args={['black']} />
      <Scene title={title} />
      <EffectComposer disableNormalPass>
        <Bloom mipmapBlur levels={9} intensity={1.5} luminanceThreshold={1} luminanceSmoothing={1} />
        <LUT lut={texture} />
      </EffectComposer>
    </Canvas>
  )
}

const GOLDENRATIO = 1.61803398875

function Scene({ title }) {
  const [isPrismHit, hitPrism] = useState(false)
  const flare = useRef(null)
  const ambient = useRef(null)
  const spot = useRef(null)
  const boxreflect = useRef(null)
  const rainbow = useRef(null)
  const wheel = useRef(0)
  const v = new THREE.Vector3()
  const [clicked, click] = useState(false)

  const rayOut = useCallback(() => hitPrism(false), [])
  const rayOver = useCallback((e) => {
    // Break raycast so the ray stops when it touches the prism
    e.stopPropagation()
    hitPrism(true)
    // Set the intensity really high on first contact
    rainbow.current.material.speed = 1
    rainbow.current.material.emissiveIntensity = 20
  }, [])

  const vec = new THREE.Vector3()
  const rayMove = useCallback(({ api, position, direction, normal }) => {
    if (!normal) return
    // Extend the line to the prisms center
    vec.toArray(api.positions, api.number++ * 3)
    // Set flare
    flare.current.position.set(position.x, position.y, -0.5)
    flare.current.rotation.set(0, 0, -Math.atan2(direction.x, direction.y))
    // Calculate refraction angles
    let angleScreenCenter = Math.atan2(-position.y, -position.x)
    const normalAngle = Math.atan2(normal.y, normal.x)
    // The angle between the ray and the normal
    const incidentAngle = angleScreenCenter - normalAngle
    // Calculate the refraction for the incident angle
    const refractionAngle = calculateRefractionAngle(incidentAngle) * 6
    // Apply the refraction
    angleScreenCenter += refractionAngle
    rainbow.current.rotation.z = angleScreenCenter
    // Set spot light
    lerpV3(spot.current.target.position, [Math.cos(angleScreenCenter), Math.sin(angleScreenCenter), 0], 0.05)
    spot.current.target.updateMatrixWorld()
  }, [])

  useFrame((state) => {
    // Tie beam to the mouse
    boxreflect.current.setRay([(state.pointer.x * state.viewport.width) / 2, (state.pointer.y * state.viewport.height) / 2, 0], [0, 0, 0])
    // Animate rainbow intensity
    lerp(rainbow.current.material, 'emissiveIntensity', isPrismHit ? 2.5 : 0, 0.1)
    spot.current.intensity = rainbow.current.material.emissiveIntensity
    // Animate ambience
    lerp(ambient.current, 'intensity', 0, 0.025)

    
    v.copy({ x: state.pointer.x, y: state.pointer.y, z: 0 })
    v.unproject(state.camera)
    if(boxreflect.current.rotation){
      boxreflect.current.rotation.x = THREE.MathUtils.lerp(boxreflect.current.rotation.x, clicked ? -0.7 : -0.5, 0.2)
    }
    if(boxreflect.current.position){
      boxreflect.current.position.lerp({ x: v.x - 100, y: wheel.current + v.y, z: v.z }, 0.4)
    }
    // state.camera.zoom = THREE.MathUtils.lerp(state.camera.zoom, clicked ? 0.9 : 0.7, clicked ? 0.025 : 0.15)
    // state.camera.position.lerp({ x: -state.pointer.x * 400, y: -state.pointer.y * 200, z: 1000 }, 0.1)
    // state.camera.lookAt(0, 0, 0)
    // state.camera.updateProjectionMatrix()
  })

  return (
    <>
      {/* Lights */}
      <ambientLight ref={ambient} intensity={0} />
      <pointLight position={[10, -10, 0]} intensity={0.05} />
      <pointLight position={[0, 10, 0]} intensity={0.05} />
      <pointLight position={[-10, 0, 0]} intensity={0.05} />
      <spotLight ref={spot} intensity={1} distance={7} angle={1} penumbra={1} position={[0, 0, 1]} />
      {/* Caption */}
      <Center top bottom position={[0, 2, 0]}>
        {/* <Text3D size={0.7} letterSpacing={-0.05} height={0.05} font="/fonts/Inter_Bold.json">
          {title}
          <meshStandardMaterial color="white" />
        </Text3D> */}
        <Text maxWidth={0.1} anchorX="left" anchorY="top" position={[0.55, GOLDENRATIO, 0]} fontSize={0.025}>
          {title}
        </Text>
      </Center>
      {/* Prism + blocks + reflect beam */}
      <Beam ref={boxreflect} bounce={10} far={20}>
        <Prism position={[0, -0.5, 0]} onRayOver={rayOver} onRayOut={rayOut} onRayMove={rayMove} />
        <Box position={[2.25, -3.5, 0]} rotation={[0, 0, Math.PI / 3.5]} />
        <Box position={[-2.5, -2.5, 0]} rotation={[0, 0, Math.PI / 4]} />
        <Box position={[-3, 1, 0]} rotation={[0, 0, Math.PI / 4]} />
      </Beam>
      {/* Rainbow and flares */}
      <Rainbow ref={rainbow} startRadius={0} endRadius={0.5} fade={0} />
      <Flare ref={flare} visible={isPrismHit} renderOrder={10} scale={1.25} streak={[12.5, 20, 1]} />
    </>
  )
}
