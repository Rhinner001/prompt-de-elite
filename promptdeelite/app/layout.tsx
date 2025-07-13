// app/layout.tsx

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from './src/components/context/AuthContext'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Prompt de Elite',
  description: 'Sua biblioteca de prompts de IA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          {/* >>> ESTE É O NOSSO PONTO DE TELETRANSPORTE <<< */}
          <div id="modal-root"></div>
        </AuthProvider>
      </body>
    </html>
  )
}