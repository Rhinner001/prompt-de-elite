'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
}

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    loading: true
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken()
          setAuthState({
            user,
            token,
            loading: false
          })
        } catch (error) {
          console.error('Erro ao obter token:', error)
          setAuthState({
            user: null,
            token: null,
            loading: false
          })
        }
      } else {
        setAuthState({
          user: null,
          token: null,
          loading: false
        })
      }
    })

    return () => unsubscribe()
  }, [])

  return authState
}
