import PricingCard from '@/app/components/PricingCard'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Planos - Prompt de Elite',
  description: 'Escolha o plano ideal para acelerar sua produtividade com IA',
}

export default function PlanosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F1C] via-slate-900 to-[#0B0F1C] relative overflow-hidden">
      {/* Partículas de fundo - otimizadas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-1 h-1 bg-blue-400/40 rounded-full animate-pulse opacity-60 particle-1" />
        <div className="absolute w-1 h-1 bg-purple-400/40 rounded-full animate-pulse opacity-60 particle-2" />
        <div className="absolute w-1 h-1 bg-yellow-400/40 rounded-full animate-pulse opacity-60 particle-3" />
        <div className="absolute w-1 h-1 bg-green-400/40 rounded-full animate-pulse opacity-60 particle-4" />
      </div>

      {/* Header com animações */}
      <div className="container mx-auto px-4 pt-20 pb-16 relative z-10">
        <div className="text-center mb-16">
          {/* Título principal com entrada suave */}
          <div className="animate-fadeInUp animation-delay-200">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 gentle-float">
              Escolha Seu <span className="text-gradient bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Plano Elite</span>
            </h1>
          </div>
          
          {/* Subtítulo com entrada suave */}
          <div className="animate-fadeInUp animation-delay-400">
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Desbloqueie todo o potencial da inteligência artificial com nossa biblioteca premium de prompts testados e otimizados
            </p>
          </div>
          
          {/* Indicadores de status com animações escalonadas */}
          <div className="animate-fadeInUp animation-delay-600 flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm text-slate-400">
            <div className="flex items-center gap-2 status-indicator">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Garantia de 7 dias</span>
            </div>
            <div className="flex items-center gap-2 status-indicator">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse pulse-delay-500"></div>
              <span>Pagamento seguro</span>
            </div>
            <div className="flex items-center gap-2 status-indicator">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse pulse-delay-1000"></div>
              <span>Suporte especializado</span>
            </div>
          </div>
        </div>

        {/* Cards de Preços com entrada lateral */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Plano Mensal - entrada da esquerda */}
          <div className="animate-slideInLeft animation-delay-800">
            <PricingCard 
              planoId="ELITE_MENSAL"
              className="transform md:-rotate-1 hover:rotate-0 transition-transform duration-500 premium-glow"
            />
          </div>
          
          {/* Plano Vitalício - entrada da direita */}
          <div className="animate-slideInRight animation-delay-1000">
            <PricingCard 
              planoId="ELITE_VITALICIO"
              highlighted={true}
              className="transform md:rotate-1 md:scale-105 hover:rotate-0 hover:scale-110 transition-all duration-500 premium-glow"
            />
          </div>
        </div>

        {/* FAQ Rápido com animações sequenciais */}
        <div className="mt-20 text-center">
          <div className="animate-fadeInUp animation-delay-1200">
            <h2 className="text-2xl font-bold text-white mb-8">
              Perguntas <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Frequentes</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
            {/* FAQ Card 1 */}
            <div className="animate-fadeInUp animation-delay-1400 faq-card bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
              <h3 className="font-bold text-white mb-2 flex items-center">
                <span className="mr-2 text-2xl">📚</span>
                Quantos prompts estão inclusos?
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Mais de <span className="text-yellow-400 font-semibold">25+ prompts</span> testados e validados. Curadoria cirúrgica com atualizações constantes.
              </p>
            </div>
            
            {/* FAQ Card 2 */}
            <div className="animate-fadeInUp animation-delay-1600 faq-card bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
              <h3 className="font-bold text-white mb-2 flex items-center">
                <span className="mr-2 text-2xl">🔄</span>
                Posso cancelar a assinatura?
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Sim, você pode cancelar a qualquer momento. <span className="text-green-400 font-semibold">Garantia de 7 dias</span> para reembolso.
              </p>
            </div>
            
            {/* FAQ Card 3 */}
            <div className="animate-fadeInUp animation-delay-1800 faq-card bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
              <h3 className="font-bold text-white mb-2 flex items-center">
                <span className="mr-2 text-2xl">⚡</span>
                O acesso é imediato?
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Sim! Após o pagamento, você terá <span className="text-blue-400 font-semibold">acesso instantâneo</span> a toda a biblioteca.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action adicional com entrada suave */}
        <div className="animate-fadeInUp animation-delay-2000 mt-16 text-center">
          <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-600/30 max-w-2xl mx-auto premium-glow">
            <h3 className="text-2xl font-bold text-white mb-4">
              🚀 Comece Sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">Transformação</span> Hoje
            </h3>
            <p className="text-slate-300 text-lg mb-6">
              Junte-se aos milhares de profissionais que já dominam a IA
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <span className="text-green-400">✓</span>
                Sem compromisso
              </span>
              <span className="flex items-center gap-1">
                <span className="text-blue-400">✓</span>
                Suporte dedicado
              </span>
              <span className="flex items-center gap-1">
                <span className="text-purple-400">✓</span>
                Atualizações constantes
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
