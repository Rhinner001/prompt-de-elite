'use client'
import { motion } from 'framer-motion'
import { FaUserPlus, FaSearch, FaRocket } from 'react-icons/fa'

const passos = [
  {
    titulo: '1. Crie sua conta',
    descricao: 'Cadastre-se rapidamente e ganhe acesso imediato à biblioteca.',
    icone: <FaUserPlus className="text-5xl text-blue-400 mb-4" />,
  },
  {
    titulo: '2. Explore os prompts',
    descricao: 'Use filtros inteligentes por nicho, objetivo ou nível de dificuldade.',
    icone: <FaSearch className="text-5xl text-green-400 mb-4" />,
  },
  {
    titulo: '3. Copie e aplique',
    descricao: 'Copie o prompt ideal e aplique direto em seu fluxo com IA.',
    icone: <FaRocket className="text-5xl text-pink-400 mb-4" />,
  },
]

export default function ComoFunciona() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-[#0A1532] to-[#0E1E4D] text-white">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          Como funciona na prática
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {passos.map((passo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group bg-white/5 p-8 rounded-xl border border-white/10 hover:shadow-2xl hover:border-blue-500 transition duration-300 text-center"
            >
              <div className="mb-4">{passo.icone}</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-destaque transition">{passo.titulo}</h3>
              <p className="text-sm text-gray-300">{passo.descricao}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
