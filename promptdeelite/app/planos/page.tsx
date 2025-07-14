import PricingCard from '@/app/components/PricingCard'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Planos - Prompt de Elite',
  description: 'Escolha o plano ideal para acelerar sua produtividade com IA',
}

export default function PlanosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F1C] via-slate-900 to-[#0B0F1C]">
      {/* Header */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Escolha Seu <span className="text-gradient bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Plano Elite</span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Desbloqueie todo o potencial da inteligência artificial com nossa biblioteca premium de prompts testados e otimizados
          </p>
          
          <div className="flex items-center justify-center gap-8 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              Garantia de 7 dias
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Pagamento seguro
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              Suporte especializado
            </div>
          </div>
        </div>

        {/* Cards de Preços */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Plano Mensal */}
          <PricingCard 
            planoId="ELITE_MENSAL"
            className="transform md:-rotate-1"
          />
          
          {/* Plano Vitalício - Destacado */}
          <PricingCard 
            planoId="ELITE_VITALICIO"
            highlighted={true}
            className="transform md:rotate-1 md:scale-105"
          />
        </div>

        {/* FAQ Rápido */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-white mb-8">Perguntas Frequentes</h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
            <div className="bg-slate-800/50 rounded-lg p-6">
              <h3 className="font-bold text-white mb-2">📚 Quantos prompts estão inclusos?</h3>
              <p className="text-slate-300 text-sm">Mais de 500+ prompts categorizados e testados, com novos adicionados regularmente.</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-6">
              <h3 className="font-bold text-white mb-2">🔄 Posso cancelar a assinatura?</h3>
              <p className="text-slate-300 text-sm">Sim, você pode cancelar a qualquer momento. Garantia de 7 dias para reembolso.</p>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-6">
              <h3 className="font-bold text-white mb-2">⚡ O acesso é imediato?</h3>
              <p className="text-slate-300 text-sm">Sim! Após o pagamento, você terá acesso instantâneo a toda a biblioteca.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
