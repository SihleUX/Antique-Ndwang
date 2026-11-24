import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#0A0A0A',
        alabaster: '#F5F5F0',
        stone: '#8C8C8C',
      },
      fontFamily: {
        display: ['var(--font-editorial)', 'Georgia', 'serif'],
        sans: ['var(--font-geometric)', 'Arial', 'sans-serif'],
      },
      letterSpacing: { editorial: '0.16em' },
    },
  },
  plugins: [],
}

export default config
