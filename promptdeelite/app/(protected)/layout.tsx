// app/(protected)/layout.tsx

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../src/components/context/AuthContext'
import Sidebar from '../components/Sidebar'
import UserHeader from '../components/UserHeader'
import { FiCpu } from 'react-icons/fi'

export default function ProtectedLayout({
  children,}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Se não estiver carregando e não houver usuário, redireciona para o login
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // Mostra uma tela de carregamento enquanto verifica a autenticação
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0B0F1C] text-white flex items-center justify-center">
        Carregando...
      </div>
    )
  }

  // Se o usuário estiver autenticado, renderiza o layout protegido
  return (
    // O div pai já está correto com 'flex'
    <div className="min-h-screen bg-[#0B0F1C] flex">
      <Sidebar />
      {/* Este div precisa ter uma altura definida para que 'absolute' funcione dentro dele */}
      <div className="flex-1 flex flex-col relative h-screen overflow-y-auto"> {/* MODIFICADO */}
        <UserHeader />
        <main className="flex-1 p-6 text-white">{children}</main>

        {/* Botão Flutuante para o EliteBot */}
        <div className="fixed bottom-8 right-12 z-50"> {/* MODIFICADO */}
          <button
            onClick={() => alert('EliteBot - Em breve: Um assistente de IA para te ajudar a encontrar e usar o prompt perfeito!')}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B0F1C] focus:ring-blue-500"
            aria-label="Abrir EliteBot"
            title="EliteBot (Em Breve)"
          >
            <FiCpu size={24} />
          </button>
        </div>
      </div>
    </div>
  )
}