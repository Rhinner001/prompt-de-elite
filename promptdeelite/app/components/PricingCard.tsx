'use client'

import { Check, Crown, Zap } from 'lucide-react'
import CheckoutButton from './CheckoutButton'

// Tipos para os planos
interface PlanoBase {
  name: string
  description: string
  price: number
  type: 'subscription' | 'one_time'
  period: string
  features: readonly string[]
}

interface PlanoMensal extends PlanoBase {
  type: 'subscription'
}

interface PlanoVitalicio extends PlanoBase {
  type: 'one_time'
  badge: string
  savings: string
}

// CONFIGURAÇÃO DOS PLANOS NO FRONTEND
const PLANOS_CONFIG = {
  ELITE_MENSAL: {
    name: 'Elite Mensal',
    description: 'Acesso completo com atualizações mensais',
    price: 27.99,
    type: 'subscription' as const,
    period: 'mensal',
    features: [
      'Acesso completo à biblioteca',
      'Novos prompts mensais',
      'Suporte prioritário',
      'Templates exclusivos'
    ]
  } as PlanoMensal,
  ELITE_VITALICIO: {
    name: 'Elite Vitalício',
    description: 'Pague uma vez, use para sempre',
    price: 105.00,
    type: 'one_time' as const,
    period: 'vitalício',
    badge: 'MAIS POPULAR',
    savings: 'Economia de R$ 231,88/ano',
    features: [
      'Acesso vitalício',
      'Todas as futuras atualizações',
      'Biblioteca completa',
      'Suporte vitalício',
      'Sem renovações'
    ]
  } as PlanoVitalicio
} as const

type PlanoId = keyof typeof PLANOS_CONFIG

interface PricingCardProps {
  planoId: PlanoId
  highlighted?: boolean
  className?: string
}

export default function PricingCard({ 
  planoId, 
  highlighted = false,
  className = '' 
}: PricingCardProps) {
  const plano = PLANOS_CONFIG[planoId]

  return (
    <div className={`
      relative bg-gradient-to-br from-slate-900 to-slate-800 
      border-2 rounded-2xl p-8 transition-all duration-300 hover:scale-105
      ${highlighted 
        ? 'border-yellow-500 shadow-2xl shadow-yellow-500/20' 
        : 'border-slate-700 hover:border-slate-600'
      }
      ${className}
    `}>
      
      {/* Badge de destaque - apenas para vitalício */}
      {planoId === 'ELITE_VITALICIO' && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1">
            <Crown className="w-4 h-4" />
            {(plano as PlanoVitalicio).badge}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className={`w-6 h-6 ${highlighted ? 'text-yellow-500' : 'text-blue-500'}`} />
          <h3 className="text-2xl font-bold text-white">{plano.name}</h3>
        </div>
        
        <p className="text-slate-400 mb-6">{plano.description}</p>
        
        <div className="mb-4">
          <div className="flex items-center justify-center gap-1">
            <span className="text-3xl font-bold text-white">R$</span>
            <span className="text-5xl font-bold text-white">
              {Math.floor(plano.price)}
            </span>
            <span className="text-lg text-slate-400">
              {plano.price % 1 !== 0 ? `,${Math.round((plano.price % 1) * 100).toString().padStart(2, '0')}` : ''}
            </span>
          </div>
          
          <p className="text-slate-400 mt-1">
            {plano.period === 'mensal' ? '/mês' : 'pagamento único'}
          </p>
          
          {/* Savings apenas para vitalício */}
          {planoId === 'ELITE_VITALICIO' && (
            <p className="text-green-400 text-sm mt-2 font-medium">
              {(plano as PlanoVitalicio).savings}
            </p>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="space-y-4 mb-8">
        {plano.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <span className="text-slate-300">{feature}</span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <CheckoutButton
        planoId={planoId}
        className={`
          w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300
          ${highlighted
            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-yellow-400 hover:to-orange-400'
            : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600'
          }
          shadow-lg hover:shadow-xl transform hover:-translate-y-1
        `}
      >
        {plano.period === 'mensal' ? 'Assinar Agora' : 'Comprar Agora'}
      </CheckoutButton>
      {/* Métodos de Pagamento */}
<div className="mt-4 text-center">
  <p className="text-xs text-slate-500 mb-2">Métodos de pagamento aceitos:</p>
  <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
    <span>💳 Cartão</span>
    {plano.type === 'one_time' && (
      <>

        <span>📄 Boleto</span>
      </>
    )}
  </div>
  {plano.type === 'one_time' && (
    <p className="text-xs text-green-400 mt-1">
      ✅ • Boleto: até 3 dias úteis
    </p>
  )}
</div>

      {/* Garantia */}
      <p className="text-center text-xs text-slate-500 mt-4">
        ✅ Garantia de 7 dias • Pagamento 100% seguro
      </p>
    </div>
  )
}
