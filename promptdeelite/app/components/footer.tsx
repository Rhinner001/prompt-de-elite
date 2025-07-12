'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="bg-[#070D1C] text-gray-400 px-6 pt-20 pb-10 border-t border-white/10">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-12">
        {/* Logo centralizada */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <Image
            src="/logo-footer.png"
            alt="Logo Prompt de Elite"
            width={180}
            height={60}
            priority
          />
          <p className="text-sm text-gray-400 max-w-md mt-4">
            Potencializando resultados com inteligência artificial aplicada. Estratégia, produtividade e automação em uma só plataforma.
          </p>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl w-full"
        >
          {[
            {
              title: '❓ Como acesso a biblioteca?',
              text: 'Crie sua conta, finalize sua entrada e ganhe acesso à área exclusiva.'
            },
            {
              title: '🎁 O que recebo ao começar?',
              text: 'Um eBook gratuito + quiz antes de liberar o conteúdo premium.'
            },
            {
              title: '🤖 Os prompts funcionam com qual IA?',
              text: 'Otimizados para ChatGPT, Gemini, Claude e outras ferramentas.'
            },
            {
              title: '🧠 Tem conteúdo pra qualquer nicho?',
              text: 'Sim! Marketing, produtividade, vendas, advocacia e mais.'
            }
          ].map((faq, i) => (
            <div
              key={i}
              className="bg-[#0E1E4D] p-3 rounded-md border border-white/10 hover:shadow-lg transition"
            >
              <p className="text-blue-400 font-semibold text-sm">{faq.title}</p>
              <p className="text-gray-300 mt-1 text-xs">{faq.text}</p>
            </div>
          ))}
        </motion.div>

        {/* Direitos autorais ao final */}
        <p className="text-xs text-gray-600 mt-10">
          © {new Date().getFullYear()} Prompt de Elite. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
