import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title:'Fanta Asta Advisor Pro', description:'Asta fantacalcio con advisor in tempo reale' }

export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="it">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#0ea5e9" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <script dangerouslySetInnerHTML={{__html:`if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}))}`}} />
      </head>
      <body>
        <header className="bg-gradient-to-r from-sky-500 to-blue-600 text-white">
          <div className="container py-4 flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold">Fanta Asta Advisor</Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/wizard" className="hover:underline">wizard</Link>
              <Link href="/dashboard/players" className="hover:underline">players</Link>
              <Link href="/dashboard/strategy" className="hover:underline">strategy</Link>
              <Link href="/dashboard/auction" className="hover:underline">auction</Link>
              <Link href="/dashboard/sealed" className="hover:underline">buste</Link>
              <Link href="/dashboard/teams" className="hover:underline">teams</Link>
              <Link href="/dashboard/targets" className="hover:underline">targets</Link>
              <Link href="/dashboard/tools/verify" className="hover:underline">verify</Link>
            </nav>
          </div>
        </header>
        <main className="container py-6">{children}</main>
      </body>
    </html>
  )
}
