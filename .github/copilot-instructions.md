# Copilot Instructions for Antique Ndwang

## Brand Identity & Aesthetic Direction

- Preserve **Antique Ndwang** as a raw, avant-garde luxury streetwear brand.
- Use a high-contrast editorial palette: obsidian `#0A0A0A`, raw alabaster `#F5F5F0`, and distressed crimson `#D92323` as an accent.
- Favor industrial steel textures, brutalist editorial typography, tactile garment movement, dramatic negative space, and restrained motion.
- Keep product storytelling centered on heavyweight boxy-fit streetwear: 280+ GSM fabrics, drop-shoulder silhouettes, bold screen-printed back graphics, and minimal chest emblems.
- Maintain a premium, unapologetic tone. Avoid generic fashion layouts, soft gradients, playful copy, or decorative clutter.

## Tech Stack & Strict Conventions

- Build with Next.js App Router and strict TypeScript. Never use `any`; define explicit interfaces and unions.
- Keep server/client boundaries intentional. Mark interactive components with `'use client'` only when browser APIs or state/hooks are required.
- Use Tailwind CSS exclusively for styling. Do not install or use Material UI, Chakra, Bootstrap, or equivalent component libraries.
- Use GSAP with ScrollTrigger and Lenis for scroll choreography. Wrap GSAP work in `gsap.context()` and revert or kill it on unmount.
- Use React Three Fiber and custom GLSL shaders for the 3D clothing rack and WebGL image distortion.
- Dispose Three.js geometries, materials, textures, render targets, and WebGL contexts on unmount or route changes.
- Use small reusable components, typed props, semantic HTML, accessible labels, and keyboard-friendly controls.
- Prefer native Next.js conventions and existing project abstractions over new dependencies.

## E-Commerce & Localization

- Treat South African Rand as the primary currency: ZAR, formatted as `R 1,250.00`.
- Preserve international currency switching capability where applicable.
- Product and lookbook experiences must support seamless Front/Back inspection.
- Garments must expose sizes `S`, `M`, `L`, `XL`, and `XXL` with clear unavailable, sold-out, and selected states.
- Bag state must persist through route changes and sync with rack, quick-view, and product-detail add-to-bag actions.
- Keep checkout, variant, size, quantity, and currency handling explicit and typed.

## Performance Standards

- Use `next/image` for 2D editorial media and provide meaningful alt text.
- Prioritize above-the-fold assets and lazy-load heavy Three.js canvases.
- Wrap heavy 3D/Suspense rendering in accessible fallbacks and responsive 2D fallbacks for low-power or mobile devices.
- Use capped device pixel ratios, efficient textures, and limited geometry complexity.
- Maintain 60fps target scroll performance by keeping GSAP and Lenis work scoped, avoiding layout thrashing, and cleaning up all observers, timelines, and ticker callbacks.
- Respect reduced-motion preferences and provide non-animated fallbacks.

## Pull Request Expectations

- Do not introduce unrelated visual or architectural changes.
- Verify responsive behavior, keyboard/accessibility support, route transitions, image loading, 3D cleanup, and bag persistence.
- Run type-checking and the relevant build/test commands before submission.
- Keep changes focused and document any required environment variables or asset names.
