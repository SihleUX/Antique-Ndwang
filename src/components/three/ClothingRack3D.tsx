'use client'

import { ContactShadows, Environment, Html, useTexture } from '@react-three/drei'
import { Canvas, ThreeEvent, useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { antiqueNdwangCatalog, type AntiqueNdwangProduct, type GarmentSize } from '@/data/antiqueNdwangCatalog'

type RackState = { selected: number | null; hovered: number | null; onSelect: (index: number) => void; onHover: (index: number | null) => void }

function SteelRack() {
  return <group position={[0, 0, -0.2]}>
    <mesh position={[0, 2.35, 0]}><boxGeometry args={[8.4, 0.09, 0.09]} /><meshStandardMaterial color="#171717" metalness={0.78} roughness={0.28} /></mesh>
    {[-4, 4].map((x) => <group key={x} position={[x, 0, 0]}>
      <mesh position={[0, 1.05, 0]}><cylinderGeometry args={[0.045, 0.06, 2.1, 16]} /><meshStandardMaterial color="#191919" metalness={0.78} roughness={0.28} /></mesh>
      <mesh position={[0, 0.04, 0]}><boxGeometry args={[0.9, 0.08, 0.6]} /><meshStandardMaterial color="#141414" metalness={0.72} roughness={0.3} /></mesh>
    </group>)}
    <mesh position={[0, 2.35, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.055, 0.055, 8.25, 16]} /><meshStandardMaterial color="#242424" metalness={0.82} roughness={0.22} /></mesh>
  </group>
}

function CurvedShirt({ product, index, state }: { product: AntiqueNdwangProduct; index: number; state: RackState }) {
  const group = useRef<THREE.Group>(null)
  const frontTexture = useTexture(product.frontImage)
  const backTexture = useTexture(product.backImage)
  const drag = useRef({ active: false, lastX: 0, rotation: 0 })
  const baseX = (index - 1.5) * 1.55
  const shirtGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(1.34, 1.55, 24, 28)
    const positions = geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      positions.setZ(i, -0.12 * x * x + 0.025 * Math.sin(y * 5 + x * 3))
    }
    geometry.computeVertexNormals()
    return geometry
  }, [])

  useEffect(() => {
    frontTexture.colorSpace = THREE.SRGBColorSpace
    backTexture.colorSpace = THREE.SRGBColorSpace
    frontTexture.anisotropy = 8
    backTexture.anisotropy = 8
    return () => { frontTexture.dispose(); backTexture.dispose(); shirtGeometry.dispose() }
  }, [frontTexture, backTexture, shirtGeometry])

  useFrame((_, delta) => {
    if (!group.current) return
    const selected = state.selected === index
    const hovering = state.hovered === index
    const centerX = state.selected === null ? baseX : selected ? 0 : (index < state.selected ? -1 : 1) * (2.05 + Math.abs(index - state.selected - 0.5) * 0.22)
    const targetX = state.selected === null ? baseX + (state.hovered !== null && index !== state.hovered ? (index < state.hovered ? -0.22 : 0.22) : 0) : centerX
    const targetZ = selected ? 1.2 : hovering ? 0.25 : -0.08
    const targetY = selected ? -0.05 : -0.15
    const ease = 1 - Math.exp(-delta * 5.2)
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX, ease)
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY + Math.sin(performance.now() * 0.0015 + index) * (selected || hovering ? 0.015 : 0.006), ease)
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, targetZ, ease)
    const baseRotation = selected ? 0 : (index - 1.5) * -0.055
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, baseRotation + drag.current.rotation + Math.sin(performance.now() * 0.001 + index) * (selected || hovering ? 0.045 : 0.012), ease)
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, selected ? 0 : (index - 1.5) * 0.02, ease)
  })

  const select = (event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); state.onSelect(index) }
  const pointerDown = (event: ThreeEvent<PointerEvent>) => { event.stopPropagation(); drag.current.active = true; drag.current.lastX = event.clientX }
  const pointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!drag.current.active || state.selected !== index) return
    drag.current.rotation += (event.clientX - drag.current.lastX) * 0.012
    drag.current.lastX = event.clientX
  }
  const pointerUp = () => { drag.current.active = false }

  return <group ref={group} position={[baseX, -0.15, -0.08]} onPointerOver={(event) => { event.stopPropagation(); state.onHover(index) }} onPointerOut={() => state.onHover(null)} onClick={select} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp}>
    {/* hanger hook and shoulders */}
    <mesh position={[0, 1.07, 0]}><torusGeometry args={[0.11, 0.018, 8, 24, Math.PI]} /><meshStandardMaterial color="#a6a6a1" metalness={0.8} roughness={0.25} /></mesh>
    <mesh position={[0, 0.95, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.018, 0.018, 1.08, 8]} /><meshStandardMaterial color="#9b9b96" metalness={0.72} roughness={0.28} /></mesh>
    <mesh position={[0, 0.89, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.018, 0.018, 0.84, 8]} /><meshStandardMaterial color="#9b9b96" metalness={0.72} roughness={0.28} /></mesh>
    <mesh geometry={shirtGeometry} position={[0, -0.03, 0.035]}>
      <meshStandardMaterial map={frontTexture} transparent side={THREE.DoubleSide} roughness={0.92} metalness={0} />
    </mesh>
    <mesh geometry={shirtGeometry} position={[0, -0.03, -0.038]} rotation={[0, Math.PI, 0]}>
      <meshStandardMaterial map={backTexture} transparent side={THREE.DoubleSide} roughness={0.92} metalness={0} />
    </mesh>
    {state.selected === index && <Html position={[0, -1.05, 0.05]} center distanceFactor={10} className="pointer-events-none"><div className="whitespace-nowrap rounded-full border border-white/15 bg-black/70 px-3 py-1 text-[9px] uppercase tracking-[.18em] text-white">Drag to inspect</div></Html>}
  </group>
}

function RackScene({ state }: { state: RackState }) {
  return <>
    <color attach="background" args={['#111110']} />
    <fog attach="fog" args={['#111110', 10, 20]} />
    <ambientLight intensity={0.75} />
    <spotLight position={[-3, 6, 5]} angle={0.55} penumbra={0.8} intensity={85} color="#fff4e8" />
    <spotLight position={[4, 4, -3]} angle={0.65} penumbra={0.75} intensity={110} color="#cbd7ff" />
    <pointLight position={[0, 0, 5]} intensity={16} color="#f6e8d7" />
    <SteelRack />
    {antiqueNdwangCatalog.map((product, index) => <CurvedShirt key={product.id} product={product} index={index} state={state} />)}
    <ContactShadows position={[0, -1.35, 0]} opacity={0.45} scale={12} blur={2.5} far={4} />
    <Environment preset="studio" />
  </>
}

function EditorialGrid({ onSelect }: { onSelect: (index: number) => void }) {
  return <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-4 md:gap-5 md:p-8">
    {antiqueNdwangCatalog.map((product, index) => <button key={product.id} onClick={() => onSelect(index)} className="group text-left">
      <span className="relative block aspect-[.78] overflow-hidden bg-[#181817]">
        <img src={product.frontImage} alt={`${product.name}, front view`} className="absolute inset-0 h-full w-full object-contain transition-opacity duration-500 group-hover:opacity-0" />
        <img src={product.backImage} alt={`${product.name}, back view`} className="absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="absolute bottom-3 left-3 text-[8px] uppercase tracking-[.15em] text-white/60">Front / Back</span>
      </span>
      <span className="mt-3 block font-display text-xl text-white md:text-2xl">{product.shortName}</span>
      <span className="mt-1 block text-[8px] uppercase tracking-[.14em] text-white/45">280 GSM · Boxy fit</span>
    </button>)}
  </div>
}

export function ClothingRack3D() {
  const [view, setView] = useState<'rack' | 'grid'>('rack')
  const [selected, setSelected] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const [size, setSize] = useState<GarmentSize>('M')
  const [mobile, setMobile] = useState(false)
  const selectedProduct = selected === null ? null : antiqueNdwangCatalog[selected]
  const rackState: RackState = { selected, hovered, onSelect: (index) => { setSelected((current) => current === index ? null : index); setSize('M') }, onHover: setHovered }

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px), (prefers-reduced-motion: reduce)')
    const update = () => setMobile(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!selectedProduct) return
    gsap.fromTo('.rack-product-hud', { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' })
    return () => { gsap.killTweensOf('.rack-product-hud') }
  }, [selectedProduct])

  const addToBag = () => {
    if (!selectedProduct) return
    window.dispatchEvent(new CustomEvent('antique:add-to-bag', { detail: { id: selectedProduct.id, title: selectedProduct.name, size, price: selectedProduct.price, image: selectedProduct.frontImage } }))
  }

  return <section id="clothing-rack" className="bg-[#111110] text-white">
    <div className="flex flex-wrap items-end justify-between gap-6 px-6 pb-5 pt-12 md:px-12 md:pt-16">
      <div><p className="text-[9px] uppercase tracking-[.24em] text-white/45">Antique Ndwang · Heavyweight essentials</p><h2 className="mt-3 font-display text-4xl tracking-[-.04em] md:text-6xl">The graphic tee study</h2></div>
      <div className="flex border border-white/20 p-1 text-[8px] uppercase tracking-[.16em]">
        <button onClick={() => setView('rack')} className={`px-4 py-3 transition-colors ${view === 'rack' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}>3D rack view</button>
        <button onClick={() => setView('grid')} className={`px-4 py-3 transition-colors ${view === 'grid' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}>2D editorial grid</button>
      </div>
    </div>
    {view === 'rack' && !mobile ? <div className="relative h-[70vh] min-h-[520px] overflow-hidden">
      <Canvas camera={{ position: [0, 0.4, 9.5], fov: 36 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: false, powerPreference: 'low-power' }} onCreated={({ gl }) => { gl.setClearColor('#111110'); gl.outputColorSpace = THREE.SRGBColorSpace }}>
        <Suspense fallback={null}><RackScene state={rackState} /></Suspense>
      </Canvas>
      <p className="pointer-events-none absolute bottom-6 left-6 text-[8px] uppercase tracking-[.18em] text-white/45 md:left-12">Select a garment · Drag to turn it · Scroll to explore</p>
      {selectedProduct && <div className="rack-product-hud absolute bottom-5 right-5 z-10 w-[min(360px,calc(100%-2.5rem))] border border-white/15 bg-[#111110]/90 p-5 backdrop-blur-md md:bottom-8 md:right-12 md:p-7">
        <div className="flex items-start justify-between gap-4"><div><p className="text-[8px] uppercase tracking-[.2em] text-white/45">{selectedProduct.gsm} GSM · {selectedProduct.fit}</p><h3 className="mt-2 font-display text-3xl leading-tight">{selectedProduct.name}</h3></div><button aria-label="Close product details" onClick={() => setSelected(null)} className="text-xl text-white/55 hover:text-white">×</button></div>
        <p className="mt-3 text-[10px] text-white/60">{selectedProduct.fabric} · {selectedProduct.frontDetail}</p>
        <div className="mt-5 flex flex-wrap gap-2">{selectedProduct.sizes.map((option) => <button key={option} onClick={() => setSize(option)} className={`h-9 min-w-9 border px-2 text-[9px] ${size === option ? 'border-white bg-white text-black' : 'border-white/20 text-white/65 hover:border-white/60'}`}>{option}</button>)}</div>
        <button onClick={addToBag} className="mt-5 flex w-full items-center justify-between bg-white px-4 py-4 text-[9px] uppercase tracking-[.18em] text-black hover:bg-[#dedbd4]"><span>Add to bag</span><span>R {selectedProduct.price.toLocaleString('en-ZA')}</span></button>
      </div>}
    </div> : <div className="relative min-h-[400px] bg-[#111110]">
      {view === 'rack' && mobile && <div className="grid grid-cols-2 gap-3 p-4">{antiqueNdwangCatalog.map((product, index) => <button key={product.id} onClick={() => { setSelected(index); setView('grid') }} className="relative aspect-[.85] bg-[#1a1a19]"><img src={product.frontImage} alt={product.name} className="h-full w-full object-contain"/><span className="absolute bottom-2 left-2 text-left text-[8px] uppercase tracking-wider">{product.shortName}</span></button>)}</div>}
      {view === 'grid' && <EditorialGrid onSelect={(index) => { setSelected(index); setSize('M') }} />}
      {view === 'grid' && selectedProduct && <div className="mx-4 mb-5 border border-white/15 bg-white/[.04] p-5 md:mx-8"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-[8px] uppercase tracking-[.18em] text-white/45">{selectedProduct.gsm} GSM · {selectedProduct.fit}</p><h3 className="mt-1 font-display text-2xl">{selectedProduct.name}</h3></div><button onClick={() => setSelected(null)} aria-label="Close selected garment" className="text-white/60">×</button></div><div className="mt-4 flex flex-wrap items-center justify-between gap-4"><div className="flex gap-2">{selectedProduct.sizes.map((option) => <button key={option} onClick={() => setSize(option)} className={`h-9 min-w-9 border px-2 text-[9px] ${size === option ? 'border-white bg-white text-black' : 'border-white/20 text-white/65'}`}>{option}</button>)}</div><button onClick={addToBag} className="bg-white px-5 py-3 text-[9px] uppercase tracking-[.18em] text-black">Add to bag · R {selectedProduct.price.toLocaleString('en-ZA')}</button></div></div>}
    </div>}
  </section>
}
