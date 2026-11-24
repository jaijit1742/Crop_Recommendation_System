import React, { Suspense, useRef, useMemo, useState, Component } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, ContactShadows, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, Box, RotateCw, Sparkles } from 'lucide-react'
import { CROP_BOTANICAL_IMAGES } from '../../utils/cropData'

// ─── Available Real 3D Models in /models/ ──────────────────────────────────
const IMPORTED_MODELS = {
  apple: '/models/apple.glb',
  orange: '/models/orange.glb',
  banana: '/models/quaternius_banana.glb',
  grapes: '/models/grapes.glb',
  mango: '/models/mango.glb',
  watermelon: '/models/watermelon.glb',
  muskmelon: '/models/muskmelon.glb',
  coconut: '/models/coconut.glb',
}

// ─── Error Boundary for 3D Loading ─────────────────────────────────────────
class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(err) {
    console.warn('3D Model load fallback triggered:', err)
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

// ─── Auto-Centering, Normalizing GLB Model Component ───────────────────────
function AutoCenteredGLB({ url, targetHeight = 2.4, yOffset = 0 }) {
  const { scene } = useGLTF(url)
  const clone = useMemo(() => {
    const c = scene.clone()
    const box = new THREE.Box3().setFromObject(c)
    const size = new THREE.Vector3()
    box.getSize(size)
    const center = new THREE.Vector3()
    box.getCenter(center)

    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = targetHeight / (maxDim || 1)
    c.scale.set(scale, scale, scale)

    c.position.x = -center.x * scale
    c.position.y = -box.min.y * scale + yOffset
    c.position.z = -center.z * scale

    c.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true
        node.receiveShadow = true
      }
    })
    return c
  }, [scene, targetHeight, yOffset])

  const ref = useRef()
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.15
  })

  return (
    <group ref={ref}>
      <primitive object={clone} />
    </group>
  )
}

// ─── Procedural Botanical Helpers ──────────────────────────────────────────

// Organic veined leaf with realistic cuticle sheen
function BotanicalLeaf({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  color = '#2e7d32',
  sheenColor = '#84C65A',
  width = 0.45,
  length = 1.6,
}) {
  const shape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, 0)
    s.bezierCurveTo(width * 0.7, length * 0.25, width, length * 0.65, 0, length)
    s.bezierCurveTo(-width, length * 0.65, -width * 0.7, length * 0.25, 0, 0)
    return s
  }, [width, length])

  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <mesh castShadow receiveShadow>
        <shapeGeometry args={[shape, 12]} />
        <meshStandardMaterial
          color={color}
          roughness={0.25}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, length / 2, 0.01]}>
        <cylinderGeometry args={[0.015, 0.025, length, 6]} />
        <meshStandardMaterial color={sheenColor} roughness={0.3} />
      </mesh>
    </group>
  )
}

// Curved organic stem with gentle natural bend
function CurvedStem({ height = 2.4, radius = 0.07, color = '#33691e', bend = 0.2 }) {
  const points = useMemo(() => [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(bend * 0.5, height * 0.35, 0),
    new THREE.Vector3(bend, height * 0.7, 0),
    new THREE.Vector3(bend * 0.7, height, 0),
  ], [height, bend])

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points])

  return (
    <mesh castShadow receiveShadow>
      <tubeGeometry args={[curve, 20, radius, 8, false]} />
      <meshStandardMaterial color={color} roughness={0.4} />
    </mesh>
  )
}

// Small delicate flower blossom (citrus, legume, coffee)
function FlowerBlossom({ position = [0, 0, 0], scale = 0.08, petalColor = '#ffffff', centerColor = '#fbc02d' }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Center stamen */}
      <mesh>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial color={centerColor} roughness={0.2} />
      </mesh>
      {/* 5 petals */}
      {[0, 1, 2, 3, 4].map(i => {
        const a = (i / 5) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 0.5, 0, Math.sin(a) * 0.5]} rotation={[0, a, 0]}>
            <sphereGeometry args={[0.35, 8, 8]} />
            <meshStandardMaterial color={petalColor} roughness={0.4} />
          </mesh>
        )
      })}
    </group>
  )
}

// ─── HIGH-FIDELITY BOTANICAL PROCEDURAL MODELS ──────────────────────────────

// 1. MAIZE / CORN: Jointed stalk, arching wavy leaves, golden cob with peeled husks & silk
function MaizePlant() {
  const group = useRef()
  useFrame((_, d) => { if (group.current) group.current.rotation.y += d * 0.15 })

  return (
    <group ref={group}>
      <CurvedStem height={3.6} radius={0.09} color="#558b2f" bend={0.08} />

      {/* Stem bamboo-like nodes */}
      {[0.6, 1.2, 1.8, 2.4, 3.0].map((y, i) => (
        <mesh key={i} position={[0.02 * i, y, 0]}>
          <torusGeometry args={[0.095, 0.02, 8, 16]} />
          <meshStandardMaterial color="#33691e" roughness={0.5} />
        </mesh>
      ))}

      {/* Primary Ear of Corn */}
      <group position={[0.22, 1.85, 0.05]} rotation={[0, 0, -0.42]}>
        {/* Golden Cob with Kernel Cylinder */}
        <mesh castShadow>
          <cylinderGeometry args={[0.18, 0.14, 1.05, 16]} />
          <meshStandardMaterial color="#fbc02d" roughness={0.25} metalness={0.08} />
        </mesh>
        {/* Husk Leaves wrapped around base and opening at tip */}
        <mesh position={[-0.04, -0.22, 0]} rotation={[0, 0, 0.2]}>
          <coneGeometry args={[0.24, 0.7, 8, 1, true]} />
          <meshStandardMaterial color="#7cb342" roughness={0.35} side={THREE.DoubleSide} />
        </mesh>
        {/* Silky Brown Corn Tassels */}
        <mesh position={[0, 0.58, 0]}>
          <coneGeometry args={[0.08, 0.35, 8]} />
          <meshStandardMaterial color="#8d6e63" roughness={0.8} />
        </mesh>
      </group>

      {/* Alternating Long Cascading Leaves */}
      {[0.7, 1.2, 1.7, 2.2, 2.7, 3.2].map((y, i) => {
        const side = i % 2 === 0 ? 1 : -1
        return (
          <BotanicalLeaf
            key={i}
            position={[side * 0.08, y, 0]}
            rotation={[-Math.PI / 4, side * 0.35, side * 0.65]}
            width={0.38}
            length={1.8}
            scale={1 - i * 0.07}
            color="#388e3c"
            sheenColor="#9ccc65"
          />
        )
      })}
    </group>
  )
}

// 2. RICE: Dense tillers with drooping golden-amber panicles & grain spikelets
function RicePlant() {
  const group = useRef()
  useFrame((_, d) => { if (group.current) group.current.rotation.y += d * 0.15 })

  return (
    <group ref={group}>
      {Array.from({ length: 11 }).map((_, i) => {
        const a = (i / 11) * Math.PI * 2
        const r = 0.15 + (i % 3) * 0.07
        return (
          <group key={i} position={[Math.cos(a) * r, 0, Math.sin(a) * r]} rotation={[0.14, a, 0]}>
            {/* Slender Green Tillers */}
            <CurvedStem height={2.3} radius={0.022} color="#4caf50" bend={0.28} />
            {/* Drooping Golden-Yellow Grain Head (Panicle) */}
            <group position={[0.28, 2.15, 0]} rotation={[0.7, 0, 0.3]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.045, 0.015, 0.85, 8]} />
                <meshStandardMaterial color="#ffd54f" roughness={0.3} metalness={0.1} />
              </mesh>
              {/* Individual Grain Spikelets */}
              {[-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3].map((y, j) => (
                <mesh key={j} position={[0.04 * (j % 2 === 0 ? 1 : -1), y, 0]}>
                  <sphereGeometry args={[0.038, 8, 8]} />
                  <meshStandardMaterial color="#ffca28" roughness={0.25} />
                </mesh>
              ))}
            </group>
          </group>
        )
      })}
    </group>
  )
}

// 3. COTTON: Branching shrub with 3-lobed leaves & fluffy white bolls
function CottonPlant() {
  const group = useRef()
  useFrame((_, d) => { if (group.current) group.current.rotation.y += d * 0.15 })

  const bolls = [
    [0.45, 1.8, 0.35],
    [-0.5, 1.9, 0.3],
    [0.3, 2.3, -0.4],
    [-0.4, 2.1, -0.35],
    [0, 2.6, 0.2],
    [0.6, 1.4, -0.2],
    [-0.55, 1.5, 0.1],
  ]

  return (
    <group ref={group}>
      <CurvedStem height={2.8} radius={0.08} color="#4e342e" bend={0.1} />

      {/* Lateral Branches */}
      {[
        [0.4, 1.5, 0, 0.8, -0.4],
        [-0.4, 1.7, 0.2, 0.75, 0.5],
        [0.2, 2.0, -0.3, 0.7, -0.5],
        [-0.3, 2.2, -0.2, 0.65, 0.4],
      ].map((b, i) => (
        <group key={i} position={[0, b[1], 0]} rotation={[0, b[2], b[4]]}>
          <mesh>
            <cylinderGeometry args={[0.035, 0.05, b[3], 6]} />
            <meshStandardMaterial color="#5d4037" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Cotton Leaves */}
      {[0.9, 1.3, 1.7, 2.1, 2.5].map((y, i) => (
        <BotanicalLeaf
          key={i}
          position={[i % 2 === 0 ? 0.3 : -0.3, y, 0]}
          rotation={[0.2, i * 1.2, 0.4]}
          width={0.4}
          length={0.9}
          color="#2e7d32"
        />
      ))}

      {/* Bursting Cotton Bolls */}
      {bolls.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Brown Star Calyx */}
          <mesh position={[0, -0.08, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.18, 0.15, 5]} />
            <meshStandardMaterial color="#4e342e" roughness={0.9} />
          </mesh>
          {/* Fluffy White Puffs */}
          {[
            [0, 0.05, 0],
            [0.08, 0.02, 0.06],
            [-0.08, 0.02, 0.06],
            [0, 0.02, -0.09],
          ].map((offset, j) => (
            <mesh key={j} position={offset} castShadow>
              <sphereGeometry args={[0.11, 10, 10]} />
              <meshStandardMaterial color="#ffffff" roughness={0.95} metalness={0.0} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

// 4. COFFEE: Glossy opposite leaves, jasmine white star blossoms & red cherries
function CoffeePlant() {
  const group = useRef()
  useFrame((_, d) => { if (group.current) group.current.rotation.y += d * 0.15 })

  const pairs = [1.0, 1.4, 1.8, 2.2, 2.6]

  return (
    <group ref={group}>
      <CurvedStem height={2.9} radius={0.07} color="#4e342e" bend={0.08} />

      {pairs.map((y, i) => (
        <group key={i} position={[0, y, 0]} rotation={[0, (i * Math.PI) / 3, 0]}>
          {/* Lateral node pair */}
          <BotanicalLeaf position={[0.4, 0, 0]} rotation={[0, 0, -0.3]} width={0.32} length={1.1} color="#1b5e20" sheenColor="#84C65A" />
          <BotanicalLeaf position={[-0.4, 0, 0]} rotation={[0, Math.PI, -0.3]} width={0.32} length={1.1} color="#1b5e20" sheenColor="#84C65A" />

          {/* Clusters of Ripe Red Coffee Cherries */}
          {[-0.15, -0.05, 0.05, 0.15].map((x, j) => (
            <mesh key={j} position={[x, 0.05, (j % 2 === 0 ? 0.08 : -0.08)]} castShadow>
              <sphereGeometry args={[0.075, 10, 10]} />
              <meshStandardMaterial color="#b71c1c" roughness={0.15} metalness={0.05} />
            </mesh>
          ))}

          {/* White Star Flower Blossoms */}
          <FlowerBlossom position={[0.2, 0.12, 0]} scale={0.07} />
          <FlowerBlossom position={[-0.2, 0.12, 0]} scale={0.07} />
        </group>
      ))}
    </group>
  )
}

// 5. PAPAYA TREE: Columnar ring-scarred trunk, crown of 7-lobed umbrella leaves, clustered papayas
function PapayaTree() {
  const group = useRef()
  useFrame((_, d) => { if (group.current) group.current.rotation.y += d * 0.14 })

  return (
    <group ref={group}>
      {/* Tall Straight Trunk with Diamond Leaf Scars */}
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.22, 3.2, 12]} />
        <meshStandardMaterial color="#6d4c41" roughness={0.8} />
      </mesh>

      {/* Trunk Leaf Scar Rings */}
      {[0.5, 1.0, 1.5, 2.0, 2.5].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <torusGeometry args={[0.17 - i * 0.01, 0.015, 6, 16]} />
          <meshStandardMaterial color="#4e342e" roughness={0.9} />
        </mesh>
      ))}

      {/* Clustered Yellow-Orange Papaya Fruits directly below crown */}
      {[0, 1, 2, 3, 4, 5].map(i => {
        const a = (i / 6) * Math.PI * 2
        return (
          <group key={i} position={[Math.cos(a) * 0.22, 2.65 - (i % 2) * 0.25, Math.sin(a) * 0.22]} rotation={[0.4, a, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.16, 12, 12]} />
              <meshStandardMaterial color="#fbc02d" roughness={0.3} metalness={0.05} />
            </mesh>
          </group>
        )
      })}

      {/* Radiating Umbrella-Like Crown of 7-Lobed Leaves */}
      {[0, 1, 2, 3, 4, 5, 6].map(i => {
        const a = (i / 7) * Math.PI * 2
        return (
          <group key={i} position={[0, 3.1, 0]} rotation={[0.45, a, 0]}>
            {/* Long hollow petiole */}
            <mesh position={[0, 0.7, 0]}>
              <cylinderGeometry args={[0.02, 0.03, 1.4, 6]} />
              <meshStandardMaterial color="#8bc34a" />
            </mesh>
            {/* Palmate 7-lobed blade */}
            <BotanicalLeaf position={[0, 1.5, 0]} rotation={[0, 0, 0]} width={0.7} length={1.3} color="#33691e" sheenColor="#84C65A" />
          </group>
        )
      })}
    </group>
  )
}

// 6. JUTE: Tall upright golden-green fiber stalks with serrated leaves & yellow flowers
function JutePlant() {
  const group = useRef()
  useFrame((_, d) => { if (group.current) group.current.rotation.y += d * 0.15 })

  return (
    <group ref={group}>
      {/* Clustered Tall Slender Stalks */}
      {[-0.15, 0, 0.15].map((x, idx) => (
        <group key={idx} position={[x, 0, (idx % 2 === 0 ? 0.08 : -0.08)]}>
          <CurvedStem height={3.7 + idx * 0.2} radius={0.045} color="#689f38" bend={0.08 * (idx - 1)} />

          {/* Alternating Ovate Leaves with Prominent Serration */}
          {[0.8, 1.3, 1.8, 2.3, 2.8, 3.3].map((y, i) => (
            <group key={i} position={[0, y, 0]} rotation={[0, i * 1.5, (i % 2 === 0 ? 0.4 : -0.4)]}>
              <BotanicalLeaf width={0.28} length={0.85} color="#558b2f" sheenColor="#84C65A" />
              {/* Small Yellow Blossom Flowers */}
              {i % 2 === 0 && <FlowerBlossom position={[0.15, 0.05, 0]} scale={0.05} petalColor="#ffeb3b" centerColor="#f57f17" />}
            </group>
          ))}
        </group>
      ))}
    </group>
  )
}

// 7. POMEGRANATE: Spreading woody shrub with spiny branches & crowned scarlet fruit
function PomegranateTree() {
  const group = useRef()
  useFrame((_, d) => { if (group.current) group.current.rotation.y += d * 0.15 })

  const poms = [
    [0.55, 2.0, 0.4],
    [-0.5, 2.2, 0.3],
    [0.4, 2.4, -0.4],
    [-0.35, 1.7, -0.45],
    [0.1, 2.6, 0.35],
  ]

  return (
    <group ref={group}>
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.2, 2.2, 10]} />
        <meshStandardMaterial color="#4e342e" roughness={0.8} />
      </mesh>

      {/* Branching canopy */}
      {[
        [0, 2.3, 0, 1.1],
        [0.4, 2.4, 0.2, 0.8],
        [-0.4, 2.3, -0.2, 0.85],
      ].map((p, i) => (
        <mesh key={i} position={[p[0], p[1], p[2]]}>
          <sphereGeometry args={[p[3], 12, 12]} />
          <meshStandardMaterial color="#2e7d32" roughness={0.4} />
        </mesh>
      ))}

      {/* Leathery Crown-Topped Pomegranates */}
      {poms.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Spherical scarlet fruit */}
          <mesh castShadow>
            <sphereGeometry args={[0.19, 14, 14]} />
            <meshStandardMaterial color="#c2185b" roughness={0.2} metalness={0.05} />
          </mesh>
          {/* Distinctive Crown Calyx at base */}
          <mesh position={[0, -0.2, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.09, 0.12, 6]} />
            <meshStandardMaterial color="#ad1457" roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// 8. LEGUME PLANTS (Chickpea, Kidney Beans, Pigeonpeas, Mothbeans, Mungbean, Blackgram, Lentil)
function LegumePlant({ podColor = '#8bc34a', leafColor = '#388e3c', podShape = 'cylindrical' }) {
  const group = useRef()
  useFrame((_, d) => { if (group.current) group.current.rotation.y += d * 0.15 })

  return (
    <group ref={group}>
      <CurvedStem height={2.4} radius={0.055} color="#558b2f" bend={0.18} />

      {/* Compound Pinnate / Trifoliate Leaves */}
      {[0.5, 0.9, 1.3, 1.7, 2.1].map((y, i) => (
        <group key={i} position={[0, y, 0]} rotation={[0, i * 1.3, 0]}>
          <BotanicalLeaf position={[0.25, 0, 0]} rotation={[0, 0, -0.4]} width={0.32} length={0.7} color={leafColor} />
          <BotanicalLeaf position={[-0.25, 0, 0]} rotation={[0, Math.PI, -0.4]} width={0.32} length={0.7} color={leafColor} />
          <BotanicalLeaf position={[0, 0.25, 0.2]} rotation={[-0.4, 0, 0]} width={0.3} length={0.65} color={leafColor} />

          {/* Hanging Characteristic Bean Pods */}
          <group position={[0.18, -0.05, 0.15]} rotation={[0.6, 0, 0.2]}>
            {podShape === 'oval' ? (
              // Swollen chickpea-style inflated pod
              <mesh castShadow>
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshStandardMaterial color={podColor} roughness={0.4} />
              </mesh>
            ) : (
              // Elongated bean pod with seed bumps
              <mesh castShadow>
                <cylinderGeometry args={[0.038, 0.025, 0.65, 8]} />
                <meshStandardMaterial color={podColor} roughness={0.3} />
              </mesh>
            )}
          </group>

          {/* Delicate Pea Blossoms */}
          <FlowerBlossom position={[-0.15, 0.1, 0.1]} scale={0.06} petalColor="#f8bbd0" centerColor="#e91e63" />
        </group>
      ))}
    </group>
  )
}

// ─── Procedural Fallbacks for Orchard & Vine Crops ──────────────────────────

function AppleTreeFallback() {
  const group = useRef()
  useFrame((_, d) => { if (group.current) group.current.rotation.y += d * 0.12 })

  return (
    <group ref={group}>
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.24, 2.2, 12]} />
        <meshStandardMaterial color="#4e342e" roughness={0.85} />
      </mesh>
      {[
        [0, 2.4, 0, 1.2],
        [0.4, 2.6, 0.3, 0.85],
        [-0.4, 2.5, -0.2, 0.9],
        [0.2, 3.0, 0, 0.75],
      ].map((pos, i) => (
        <mesh key={i} position={[pos[0], pos[1], pos[2]]}>
          <sphereGeometry args={[pos[3], 16, 16]} />
          <meshStandardMaterial color="#2e7d32" roughness={0.3} />
        </mesh>
      ))}
      {[
        [0.6, 2.4, 0.5],
        [-0.5, 2.6, 0.6],
        [0.7, 2.1, -0.4],
        [-0.6, 2.2, -0.5],
      ].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color="#d32f2f" roughness={0.15} metalness={0.05} />
        </mesh>
      ))}
    </group>
  )
}

function BananaPlantFallback() {
  const group = useRef()
  useFrame((_, d) => { if (group.current) group.current.rotation.y += d * 0.12 })

  return (
    <group ref={group}>
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.3, 2.8, 12]} />
        <meshStandardMaterial color="#689f38" roughness={0.35} />
      </mesh>
      {[0, 1, 2, 3, 4].map(i => {
        const a = (i / 5) * Math.PI * 2
        return (
          <group key={i} position={[0, 2.7, 0]} rotation={[0.6, a, 0]}>
            <mesh position={[0, 1.2, 0]}>
              <planeGeometry args={[0.65, 2.6, 4, 8]} />
              <meshStandardMaterial color="#4caf50" roughness={0.25} side={THREE.DoubleSide} />
            </mesh>
          </group>
        )
      })}
      <group position={[0.35, 2.1, 0]} rotation={[0.3, 0, -0.4]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.18, 0.12, 0.9, 10]} />
          <meshStandardMaterial color="#fbc02d" roughness={0.2} />
        </mesh>
      </group>
    </group>
  )
}

function GrapeVineFallback() {
  const group = useRef()
  useFrame((_, d) => { if (group.current) group.current.rotation.y += d * 0.15 })

  return (
    <group ref={group}>
      <mesh position={[0, 1.3, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.1, 2.6, 8]} />
        <meshStandardMaterial color="#4e342e" roughness={0.8} />
      </mesh>
      {[
        [0.35, 1.8, 0.2],
        [-0.3, 2.1, -0.2],
        [0.2, 2.4, -0.3],
      ].map((pos, i) => (
        <group key={i} position={pos}>
          <mesh castShadow>
            <coneGeometry args={[0.2, 0.55, 10]} />
            <meshStandardMaterial color="#4a148c" roughness={0.2} metalness={0.1} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function MelonPlantFallback({ isMuskmelon = false }) {
  const group = useRef()
  useFrame((_, d) => { if (group.current) group.current.rotation.y += d * 0.15 })

  return (
    <group ref={group}>
      <CurvedStem height={1.2} radius={0.04} color="#689f38" bend={0.6} />
      {/* Large Melon on ground */}
      <mesh position={[0.55, 0.38, 0]} rotation={[0, 0, 0.1]} castShadow>
        <sphereGeometry args={[isMuskmelon ? 0.42 : 0.52, 18, 18]} />
        <meshStandardMaterial
          color={isMuskmelon ? '#dce775' : '#2e7d32'}
          roughness={isMuskmelon ? 0.5 : 0.2}
          metalness={0.05}
        />
      </mesh>
      {[0, 1, 2, 3].map(i => (
        <BotanicalLeaf
          key={i}
          position={[Math.cos(i) * 0.4, 0.15, Math.sin(i) * 0.4]}
          rotation={[0.3, i, 0]}
          width={0.4}
          length={0.8}
          color="#388e3c"
        />
      ))}
    </group>
  )
}

function CoconutPalmFallback() {
  const group = useRef()
  useFrame((_, d) => { if (group.current) group.current.rotation.y += d * 0.12 })

  return (
    <group ref={group}>
      <CurvedStem height={3.8} radius={0.14} color="#5d4037" bend={0.35} />
      {[0, 1, 2, 3, 4, 5, 6].map(i => {
        const a = (i / 7) * Math.PI * 2
        return (
          <group key={i} position={[0.25, 3.65, 0]} rotation={[0.4, a, 0]}>
            <BotanicalLeaf width={0.45} length={2.2} color="#2e7d32" sheenColor="#84C65A" />
          </group>
        )
      })}
      {[0, 1, 2, 3].map(i => {
        const a = (i / 4) * Math.PI * 2
        return (
          <mesh key={i} position={[0.25 + Math.cos(a) * 0.2, 3.45, Math.sin(a) * 0.2]} castShadow>
            <sphereGeometry args={[0.13, 10, 10]} />
            <meshStandardMaterial color="#4e342e" roughness={0.7} />
          </mesh>
        )
      })}
    </group>
  )
}

function OrangeTreeFallback() {
  const group = useRef()
  useFrame((_, d) => { if (group.current) group.current.rotation.y += d * 0.12 })

  return (
    <group ref={group}>
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.22, 2.2, 10]} />
        <meshStandardMaterial color="#4e342e" roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.4, 0]}>
        <sphereGeometry args={[1.15, 14, 14]} />
        <meshStandardMaterial color="#2e7d32" roughness={0.35} />
      </mesh>
      {[
        [0.6, 2.3, 0.4],
        [-0.5, 2.5, 0.5],
        [0.5, 2.0, -0.4],
        [-0.4, 2.1, -0.5],
      ].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <sphereGeometry args={[0.17, 14, 14]} />
          <meshStandardMaterial color="#f57c00" roughness={0.35} />
        </mesh>
      ))}
    </group>
  )
}

function MangoTreeFallback() {
  const group = useRef()
  useFrame((_, d) => { if (group.current) group.current.rotation.y += d * 0.12 })

  return (
    <group ref={group}>
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.23, 2.2, 10]} />
        <meshStandardMaterial color="#4e342e" roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.5, 0]}>
        <sphereGeometry args={[1.25, 14, 14]} />
        <meshStandardMaterial color="#1b5e20" roughness={0.35} />
      </mesh>
      {[
        [0.6, 2.3, 0.4],
        [-0.5, 2.5, 0.5],
        [0.5, 2.0, -0.4],
      ].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <sphereGeometry args={[0.19, 14, 14]} />
          <meshStandardMaterial color="#fbc02d" roughness={0.25} />
        </mesh>
      ))}
    </group>
  )
}

// ─── MASTER CROP 3D MODEL REGISTRY (ALL 22 CROPS) ───────────────────────────
const CROP_MODELS = {
  // Grains & Fibers
  rice: () => <RicePlant />,
  maize: () => <MaizePlant />,
  jute: () => <JutePlant />,
  cotton: () => <CottonPlant />,

  // Fruits with Available Real GLB (with Fallbacks)
  apple: () =>
    IMPORTED_MODELS.apple ? (
      <ModelErrorBoundary fallback={<AppleTreeFallback />}>
        <Suspense fallback={<AppleTreeFallback />}>
          <AutoCenteredGLB url={IMPORTED_MODELS.apple} targetHeight={2.2} />
        </Suspense>
      </ModelErrorBoundary>
    ) : (
      <AppleTreeFallback />
    ),

  banana: () =>
    IMPORTED_MODELS.banana ? (
      <ModelErrorBoundary fallback={<BananaPlantFallback />}>
        <Suspense fallback={<BananaPlantFallback />}>
          <AutoCenteredGLB url={IMPORTED_MODELS.banana} targetHeight={2.3} />
        </Suspense>
      </ModelErrorBoundary>
    ) : (
      <BananaPlantFallback />
    ),

  orange: () =>
    IMPORTED_MODELS.orange ? (
      <ModelErrorBoundary fallback={<OrangeTreeFallback />}>
        <Suspense fallback={<OrangeTreeFallback />}>
          <AutoCenteredGLB url={IMPORTED_MODELS.orange} targetHeight={2.2} />
        </Suspense>
      </ModelErrorBoundary>
    ) : (
      <OrangeTreeFallback />
    ),

  grapes: () =>
    IMPORTED_MODELS.grapes ? (
      <ModelErrorBoundary fallback={<GrapeVineFallback />}>
        <Suspense fallback={<GrapeVineFallback />}>
          <AutoCenteredGLB url={IMPORTED_MODELS.grapes} targetHeight={2.3} />
        </Suspense>
      </ModelErrorBoundary>
    ) : (
      <GrapeVineFallback />
    ),

  mango: () =>
    IMPORTED_MODELS.mango ? (
      <ModelErrorBoundary fallback={<MangoTreeFallback />}>
        <Suspense fallback={<MangoTreeFallback />}>
          <AutoCenteredGLB url={IMPORTED_MODELS.mango} targetHeight={2.2} />
        </Suspense>
      </ModelErrorBoundary>
    ) : (
      <MangoTreeFallback />
    ),

  watermelon: () =>
    IMPORTED_MODELS.watermelon ? (
      <ModelErrorBoundary fallback={<MelonPlantFallback isMuskmelon={false} />}>
        <Suspense fallback={<MelonPlantFallback isMuskmelon={false} />}>
          <AutoCenteredGLB url={IMPORTED_MODELS.watermelon} targetHeight={1.9} yOffset={0.1} />
        </Suspense>
      </ModelErrorBoundary>
    ) : (
      <MelonPlantFallback isMuskmelon={false} />
    ),

  muskmelon: () =>
    IMPORTED_MODELS.muskmelon ? (
      <ModelErrorBoundary fallback={<MelonPlantFallback isMuskmelon={true} />}>
        <Suspense fallback={<MelonPlantFallback isMuskmelon={true} />}>
          <AutoCenteredGLB url={IMPORTED_MODELS.muskmelon} targetHeight={1.9} yOffset={0.1} />
        </Suspense>
      </ModelErrorBoundary>
    ) : (
      <MelonPlantFallback isMuskmelon={true} />
    ),

  coconut: () =>
    IMPORTED_MODELS.coconut ? (
      <ModelErrorBoundary fallback={<CoconutPalmFallback />}>
        <Suspense fallback={<CoconutPalmFallback />}>
          <AutoCenteredGLB url={IMPORTED_MODELS.coconut} targetHeight={2.5} />
        </Suspense>
      </ModelErrorBoundary>
    ) : (
      <CoconutPalmFallback />
    ),

  // Distinct Trees & Shrubs
  papaya: () => <PapayaTree />,
  coffee: () => <CoffeePlant />,
  pomegranate: () => <PomegranateTree />,

  // Legumes with Specific Pod & Leaf Shapes
  chickpea: () => <LegumePlant podColor="#8bc34a" leafColor="#388e3c" podShape="oval" />,
  kidneybeans: () => <LegumePlant podColor="#b71c1c" leafColor="#2e7d32" podShape="cylindrical" />,
  pigeonpeas: () => <LegumePlant podColor="#ffd54f" leafColor="#43a047" podShape="cylindrical" />,
  mothbeans: () => <LegumePlant podColor="#9ccc65" leafColor="#558b2f" podShape="cylindrical" />,
  mungbean: () => <LegumePlant podColor="#2e7d32" leafColor="#33691e" podShape="cylindrical" />,
  blackgram: () => <LegumePlant podColor="#212121" leafColor="#2e7d32" podShape="cylindrical" />,
  lentil: () => <LegumePlant podColor="#b0bec5" leafColor="#558b2f" podShape="oval" />,
}

// ─── 3D Scene Container with Studio Lighting & Soft Contact Shadows ─────────
function CropScene({ cropId }) {
  const ModelComp = CROP_MODELS[cropId] || CROP_MODELS['rice']

  return (
    <>
      {/* Studio Lighting Setup */}
      <ambientLight intensity={0.7} color="#f1f8e9" />
      <directionalLight position={[5, 8, 4]} intensity={1.8} color="#fffde7" castShadow />
      <directionalLight position={[-4, 3, -3]} intensity={0.65} color="#84C65A" />
      <pointLight position={[0, 4, 3]} intensity={0.8} color="#a4e635" />

      {/* Model Group */}
      <group position={[0, -0.65, 0]} scale={0.52}>
        <ModelComp />

        {/* Soft Contact Shadow under Model */}
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.45}
          scale={3.2}
          blur={2.0}
          far={2.0}
          color="#03150d"
        />
      </group>

      <OrbitControls
        enablePan={false}
        minDistance={2.5}
        maxDistance={8.0}
        enableDamping
        dampingFactor={0.06}
      />
    </>
  )
}

// ─── Main CropViewer3D Component ────────────────────────────────────────────
export default function CropViewer3D({ selectedCrop }) {
  const [viewMode, setViewMode] = useState('3d') // '3d' | 'botanical'

  const telemetryLeft = [
    { label: 'Soil Sprayer', value: '38 psi', icon: '💧' },
    { label: 'Leaf Moisture', value: '72%', icon: '🌿' },
    { label: 'Plant Spacing', value: 'Optimal', icon: '📐' },
  ]

  const telemetryRight = [
    { label: 'AI Diagnostic', value: 'Optimal', icon: '🛰️' },
    { label: 'NPK Balance', value: 'Matched', icon: '🧪' },
    { label: 'Yield Potential', value: 'High', icon: '📈' },
  ]

  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
      {/* Emerald Ambient Radial Aura */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="w-96 h-96 rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(132,198,90,0.25) 0%, transparent 70%)' }}
        />
      </div>

      {/* Floating Telemetry Nodes — Left */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-3 pointer-events-none">
        {telemetryLeft.map((node, i) => (
          <motion.div
            key={node.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i, duration: 0.5 }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl backdrop-blur-md border border-white/10"
            style={{ background: 'rgba(11,48,36,0.75)' }}
          >
            <span className="text-base">{node.icon}</span>
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-wider">{node.label}</p>
              <p className="text-xs font-semibold text-white/90">{node.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Floating Telemetry Nodes — Right */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-3 pointer-events-none">
        {telemetryRight.map((node, i) => (
          <motion.div
            key={node.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i, duration: 0.5 }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl backdrop-blur-md border border-white/10 text-right"
            style={{ background: 'rgba(11,48,36,0.75)' }}
          >
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-wider">{node.label}</p>
              <p className="text-xs font-semibold text-white/90">{node.value}</p>
            </div>
            <span className="text-base">{node.icon}</span>
          </motion.div>
        ))}
      </div>

      {/* View Toggle Bar (3D Interactive vs High-Res Botanical Specimen) */}
      <div className="absolute top-4 right-6 z-20 flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md">
        <button
          onClick={() => setViewMode('3d')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            viewMode === '3d'
              ? 'bg-[#84C65A] text-[#071E17] shadow-md shadow-[#84C65A]/20'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>Interactive 3D</span>
        </button>
        <button
          onClick={() => setViewMode('botanical')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            viewMode === 'botanical'
              ? 'bg-[#84C65A] text-[#071E17] shadow-md shadow-[#84C65A]/20'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Botanical Photo</span>
        </button>
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm">
        <RotateCw className="w-3 h-3 text-[#84C65A] animate-spin" style={{ animationDuration: '6s' }} />
        <p className="text-white/50 text-[11px]">360° Live Rotation · Drag to Inspect · Scroll to Zoom</p>
      </div>

      {/* Content Rendering: 3D Canvas OR High-Res Botanical Photo */}
      <AnimatePresence mode="wait">
        {viewMode === '3d' ? (
          <motion.div
            key={`3d-${selectedCrop.id}`}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
          >
            <Canvas
              camera={{ position: [0, 1.2, 5.0], fov: 42 }}
              gl={{ antialias: true, alpha: true }}
              shadows
              className="w-full h-full"
            >
              <Suspense fallback={null}>
                <CropScene cropId={selectedCrop.id} />
              </Suspense>
            </Canvas>
          </motion.div>
        ) : (
          <motion.div
            key={`photo-${selectedCrop.id}`}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full flex flex-col items-center justify-center p-8 z-10"
          >
            <div className="relative max-w-md w-full aspect-square rounded-3xl overflow-hidden border border-white/15 shadow-2xl">
              <img
                src={CROP_BOTANICAL_IMAGES[selectedCrop.id] || CROP_BOTANICAL_IMAGES['rice']}
                alt={selectedCrop.label}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#84C65A] text-[#071E17] font-bold w-fit mb-2 uppercase tracking-wider">
                  Botanical Specimen
                </span>
                <p className="text-white font-extrabold text-2xl">{selectedCrop.label}</p>
                <p className="text-white/60 text-xs italic">{selectedCrop.scientific}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
