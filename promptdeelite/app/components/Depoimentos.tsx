'use client'
import { motion } from 'framer-motion'

const depoimentos = [
  {
    nome: 'Amanda Lopes',
    profissao: 'Social Media',
    texto: 'A biblioteca do Prompt de Elite me economiza pelo menos 3 horas por semana. As ideias de conteúdo são muito acima da média.',
  },
  {
    nome: 'João Vitor',
    profissao: 'Afiliado Profissional',
    texto: 'Consegui melhorar minhas campanhas em 2 dias usando apenas os prompts prontos. Parece que alguém já testou tudo por mim.',
  },
  {
    nome: 'Fernanda Rocha',
    profissao: 'Advogada e Mentora',
    texto: 'O Prompt de Elite entregou exatamente o que eu precisava: estratégia com IA sem perder minha identidade profissional.',
  },
]

export default function Depoimentos() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-[#0E1E4D] to-[#0A1532] text-white">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-16"
        >
          O que estão dizendo
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {depoimentos.map((dep, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 p-6 rounded-xl shadow-md hover:shadow-blue-400/20 transition"
            >
              <p className="text-gray-300 italic mb-4">“{dep.texto}”</p>
              <div className="mt-4">
                <p className="text-lg font-semibold text-destaque">{dep.nome}</p>
                <p className="text-sm text-gray-400">{dep.profissao}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
