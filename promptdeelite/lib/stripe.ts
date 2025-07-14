import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY não configurado')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil',
  typescript: true,
})

export const PLANOS = {
  ELITE_MENSAL: {
    name: 'Elite Mensal',
    description: 'Acesso completo com atualizações mensais',
    price: 27.99,
    priceId: process.env.STRIPE_PRICE_ELITE_MENSAL!,
    type: 'subscription' as const,
    period: 'mensal',
    features: [
      'Acesso completo à biblioteca',
      'Novos prompts mensais',
      'Suporte prioritário',
      'Templates exclusivos'
    ]
  },
  ELITE_VITALICIO: {
    name: 'Elite Vitalício',
    description: 'Pague uma vez, use para sempre',
    price: 105.00,
    priceId: process.env.STRIPE_PRICE_ELITE_VITALICIO!,
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
  }
} as const

export type PlanoType = keyof typeof PLANOS

// MÉTODOS DE PAGAMENTO BRASILEIROS
export const PAYMENT_METHODS_BR = [
  'card',
  'boleto',
  'pix'
] as const
