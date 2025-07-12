'use client'
import { motion } from 'framer-motion'

const nichos = [
  {
    titulo: 'Criadores de Conteúdo com IA',
    descricao: 'Ideias de conteúdo, roteiros virais e legendas otimizadas para redes sociais.',
    nivel: 'Iniciante',
    cor: 'text-green-400',
  },
  {
    titulo: 'Marketing Digital e Vendas',
    descricao: 'Funis, copys e campanhas automatizadas com inteligência estratégica.',
    nivel: 'Intermediário',
    cor: 'text-yellow-400',
  },
  {
    titulo: 'Afiliados e Tráfego Pago',
    descricao: 'Scripts de vendas, anúncios e sequências para conversão com IA.',
    nivel: 'Intermediário',
    cor: 'text-yellow-400',
  },
  {
    titulo: 'Finanças e Advocacia com IA',
    descricao: 'Análises financeiras, automações jurídicas e diagnósticos com IA.',
    nivel: 'Avançado',
    cor: 'text-red-400',
  },
  {
    titulo: 'Automação de Atendimento',
    descricao: 'Fluxos para WhatsApp, Telegram e CRMs com IA integrada.',
    nivel: 'Avançado',
    cor: 'text-red-400',
  },
  {
    titulo: 'Produtividade com IA',
    descricao: 'Organize sua rotina com prompts baseados em métodos reais (GTD, Atomic Habits).',
    nivel: 'Iniciante',
    cor: 'text-green-400',
  },
]

export default function Nichos() {
  return (
    <section className="py-20 px-6 bg-royal text-white">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Soluções Inteligentes com IA por Profissão
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {nichos.map((nicho, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-fundo border border-white/10 rounded-xl p-6 shadow-xl transition duration-300 hover:shadow-blue-500/30"
            >
              <h3 className="text-xl font-semibold mb-2">{nicho.titulo}</h3>
              <p className="text-sm text-gray-300 mb-4">{nicho.descricao}</p>
              <span className={`text-sm font-bold ${nicho.cor}`}>Nível: {nicho.nivel}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
