'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrthographicCamera, useTexture } from '@react-three/drei'
import gsap from 'gsap'
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec2 vScreenUv;

  void main() {
    vUv = uv;
    vec4 clipPosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vScreenUv = clipPosition.xy / clipPosition.w * 0.5 + 0.5;
    gl_Position = clipPosition;
  }
`

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform vec2 uImageResolution;
  uniform float uHover;
  uniform float uTime;
  uniform float uVelocity;
  uniform float uReveal;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  vec2 coverUv(vec2 uv, vec2 plane, vec2 image) {
    float planeAspect = plane.x / plane.y;
    float imageAspect = image.x / image.y;
    vec2 scale = planeAspect > imageAspect
      ? vec2(1.0, imageAspect / planeAspect)
      : vec2(planeAspect / imageAspect, 1.0);
    return (uv - 0.5) * scale + 0.5;
  }

  void main() {
    vec2 uv = coverUv(vUv, uResolution, uImageResolution);
    float radius = distance(vUv, uMouse);
    float fabricWave = sin(radius * 42.0 - uTime * 2.4) * exp(-radius * 8.0);
    float displacement = (fabricWave * 0.004 + uVelocity * 0.006) * uHover;
    vec2 direction = normalize(vUv - uMouse + vec2(0.0001));
    vec2 distortedUv = uv + direction * displacement;

    float rgbShift = (0.002 + abs(uVelocity) * 0.002) * uHover;
    vec4 red = texture2D(uTexture, distortedUv + vec2(rgbShift, 0.0));
    vec4 green = texture2D(uTexture, distortedUv);
    vec4 blue = texture2D(uTexture, distortedUv - vec2(rgbShift, 0.0));
    vec3 color = vec3(red.r, green.g, blue.b);

    float luminance = dot(color, vec3(0.299, 0.587, 0.114));
    vec3 monochrome = vec3(luminance * 0.76);
    float grain = (hash(gl_FragCoord.xy + uTime * 17.0) - 0.5) * 0.12 * (1.0 - uReveal);
    vec3 gritty = clamp(monochrome + grain, 0.0, 1.0);
    vec3 crisp = clamp((color - 0.5) * 1.12 + 0.5, 0.0, 1.0);
    color = mix(gritty, crisp, uReveal);

    gl_FragColor = vec4(color, green.a);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

type WebGLImagePlaneProps = {
  src: string
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
}

type ImagePlaneProps = WebGLImagePlaneProps & { onContextReady: (renderer: THREE.WebGLRenderer) => void }

function ImagePlane({ src, alt, onContextReady }: ImagePlaneProps) {
  const texture = useTexture(src)
  const material = useRef<THREE.ShaderMaterial>(null)
  const mesh = useRef<THREE.Mesh>(null)
  const { size, gl } = useThree()
  const pointer = useRef(new THREE.Vector2(0.5, 0.5))
  const previousPointer = useRef(new THREE.Vector2(0.5, 0.5))
  const uniforms = useMemo(() => ({
    uTexture: { value: texture },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uImageResolution: { value: new THREE.Vector2(1, 1) },
    uHover: { value: 0 },
    uTime: { value: 0 },
    uVelocity: { value: 0 },
    uReveal: { value: 0 },
  }), [texture])

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.minFilter = THREE.LinearMipmapLinearFilter
    texture.generateMipmaps = true
    texture.needsUpdate = true
    uniforms.uImageResolution.value.set(texture.image.width || 1, texture.image.height || 1)
    onContextReady(gl)
    return () => {
      texture.dispose()
      uniforms.uTexture.value = null
    }
  }, [gl, onContextReady, texture, uniforms])

  useFrame((state, delta) => {
    const shader = material.current
    const plane = mesh.current
    if (!shader || !plane) return

    shader.uniforms.uTime.value += delta
    shader.uniforms.uResolution.value.set(size.width, size.height)
    shader.uniforms.uMouse.value.lerp(pointer.current, 1 - Math.exp(-delta * 12))
    const velocity = pointer.current.distanceTo(previousPointer.current) / Math.max(delta, 0.001)
    shader.uniforms.uVelocity.value = THREE.MathUtils.damp(shader.uniforms.uVelocity.value, Math.min(velocity, 1), 8, delta)
    previousPointer.current.copy(pointer.current)
    shader.uniforms.uHover.value = THREE.MathUtils.damp(shader.uniforms.uHover.value, plane.userData.hover ? 1 : 0, 7, delta)

    const bounds = state.gl.domElement.parentElement?.getBoundingClientRect()
    if (bounds) {
      const progress = THREE.MathUtils.clamp((window.innerHeight - bounds.top) / (window.innerHeight + bounds.height * 0.35), 0, 1)
      shader.uniforms.uReveal.value = THREE.MathUtils.damp(shader.uniforms.uReveal.value, progress, 3.5, delta)
    }
  })

  const onPointerMove = useCallback((event: THREE.Event & { uv?: THREE.Vector2 }) => {
    if (event.uv) pointer.current.copy(event.uv)
  }, [])

  return (
    <mesh ref={mesh} onPointerMove={onPointerMove} onPointerEnter={() => { if (mesh.current) mesh.current.userData.hover = true }} onPointerLeave={() => { if (mesh.current) mesh.current.userData.hover = false }}>
      <planeGeometry args={[2, 2, 1, 1]} />
      <shaderMaterial ref={material} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} toneMapped={false} />
    </mesh>
  )
}

function LowPowerFallback({ src, alt, sizes, priority }: WebGLImagePlaneProps) {
  return <img src={src} alt={alt} sizes={sizes} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} className="h-full w-full object-cover" />
}

export function WebGLImagePlane({ src, alt, className = '', sizes = '100vw', priority = false }: WebGLImagePlaneProps) {
  const [useFallback, setUseFallback] = useState(false)
  const renderer = useRef<THREE.WebGLRenderer | null>(null)
  const setRenderer = useCallback((value: THREE.WebGLRenderer) => { renderer.current = value }, [])

  useEffect(() => {
    const lowPower = window.matchMedia('(max-width: 767px), (prefers-reduced-motion: reduce)').matches
      || (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4)
      || (('deviceMemory' in navigator) && Number((navigator as Navigator & { deviceMemory?: number }).deviceMemory) <= 4)
    setUseFallback(lowPower)

    return () => {
      const gl = renderer.current
      if (!gl) return
      gl.renderLists.dispose()
      gl.dispose()
      gl.forceContextLoss()
      renderer.current = null
    }
  }, [])

  if (useFallback) {
    return <div className={`relative h-full w-full overflow-hidden ${className}`}><LowPowerFallback src={src} alt={alt} sizes={sizes} priority={priority} /></div>
  }

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`} role="img" aria-label={alt}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ alpha: false, antialias: false, powerPreference: 'low-power' }}
        fallback={<LowPowerFallback src={src} alt={alt} sizes={sizes} priority={priority} />}
      >
        <Suspense fallback={null}>
          <OrthographicCamera makeDefault position={[0, 0, 5]} zoom={1} near={0.1} far={10} />
          <ImagePlane src={src} alt={alt} onContextReady={setRenderer} />
        </Suspense>
      </Canvas>
    </div>
  )
}
