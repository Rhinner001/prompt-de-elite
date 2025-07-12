'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-[#0E1E4D] to-[#0A1532] text-white py-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Texto */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="md:w-1/2 text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            Desbloqueie o poder dos <span className="text-blue-400">prompts com IA</span>
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Crie conteúdos estratégicos, economize tempo e escale resultados com uma biblioteca feita por especialistas em inteligência artificial.
          </p>
          <a
            href="/login"
            className="inline-block bg-blue-500 hover:bg-blue-600 transition px-8 py-3 rounded-lg font-semibold text-white"
          >
            Liberar meu acesso →
          </a>
        </motion.div>

        {/* Imagem */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="md:w-1/2 flex justify-center"
        >
          <div className="w-full max-w-md">
            <Image
              src="/hero-img.png"
              alt="IA interagindo com prompts"
              width={500}
              height={500}
              className="rounded-xl shadow-2xl"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
