// app/(protected)/conta/page.tsx

'use client'

import { updateProfile } from 'firebase/auth'
import { useState } from 'react'
import { useAuth } from '../../src/components/context/AuthContext' // O caminho mudou um pouco

export default function ContaPage() {
  const { user } = useAuth() // Já sabemos que o user existe por causa do layout
  const [displayName, setDisplayName] = useState(user?.displayName || '')
  
  // A verificação de loading e user não é mais necessária aqui
  if (!user) return null // Apenas uma guarda extra

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Minha Conta</h1>
      <div className="bg-[#11182B] p-6 rounded-lg shadow border border-white/10">
        <p className="mb-4">
          <strong>Email:</strong> {user.email}
        </p>

        <label className="block mb-2 text-sm text-gray-300">
          Nome de exibição:
        </label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded bg-white/10 border border-white/10 text-white"
          placeholder="Seu nome"
        />

        <button
          onClick={async () => {
            try {
              if (user) {
                await updateProfile(user, { displayName })
                alert('✅ Nome atualizado com sucesso!')
              }
            } catch (err) {
              console.error('Erro ao atualizar nome:', err)
              alert('❌ Não foi possível atualizar seu nome.')
            }
          }}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white font-medium transition"
        >
          Salvar
        </button>
      </div>
    </div>
  )
}