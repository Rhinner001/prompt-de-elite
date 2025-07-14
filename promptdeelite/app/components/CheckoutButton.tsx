'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { stripePromise } from '@/lib/stripe-client'

interface CheckoutButtonProps {
  planoId: string
  className?: string
  children: React.ReactNode
  disabled?: boolean
}

export default function CheckoutButton({ 
  planoId, 
  className = '', 
  children, 
  disabled = false 
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const { user, token, loading: authLoading } = useAuth()

  const handleCheckout = async () => {
    if (authLoading) return

    if (!user || !token) {
      window.location.href = '/login?redirect=/planos'
      return
    }

    try {
      setLoading(true)

      console.log('🚀 Iniciando checkout para:', planoId)

      // Criar sessão de checkout
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ planoId }),
      })

      console.log('📡 Response status:', response.status)
      console.log('📡 Response headers:', response.headers)

      // Verificar se a resposta é JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text()
        console.error('❌ Resposta não é JSON:', textResponse)
        throw new Error(`Erro do servidor: ${response.status} - Resposta inválida`)
      }

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ Erro da API:', errorData)
        throw new Error(errorData.error || `Erro HTTP: ${response.status}`)
      }

      const data = await response.json()
      console.log('✅ Dados recebidos:', data)

      if (!data.sessionId) {
        throw new Error('Session ID não retornado pela API')
      }

      // Redirecionar para Stripe Checkout
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error('Stripe não carregado')
      }

      console.log('🔄 Redirecionando para Stripe...')
      const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId })

      if (error) {
        console.error('❌ Erro no redirect:', error)
        throw error
      }

    } catch (error) {
      console.error('❌ Erro completo no checkout:', error)
      alert(`Erro ao processar pagamento: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <button disabled className={className}>
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Carregando...
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={disabled || loading}
      className={`
        relative overflow-hidden transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Processando...
        </div>
      ) : (
        children
      )}
    </button>
  )
}
