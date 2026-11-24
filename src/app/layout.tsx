import type { Metadata } from 'next'
import { Cormorant_Garamond, Manrope } from 'next/font/google'
import './globals.css'
import { SiteHeader } from '@/components/ui/site-header'
import { SmoothScrollProvider } from '@/components/animations/SmoothScrollProvider'

const editorial = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-editorial',
  display: 'swap',
  weight: ['400', '500', '600'],
})

const geometric = Manrope({
  subsets: ['latin'],
  variable: '--font-geometric',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Antique Ndwang — The shape of becoming',
  description: 'A study in form, feeling, and the enduring art of getting dressed.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${editorial.variable} ${geometric.variable}`}>
      <body>
        <SmoothScrollProvider>
          <SiteHeader />
          <main>{children}</main>
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
