// app/politicadeprivacidade/page.tsx

export const metadata = {
  title: 'Política de Privacidade | Prompt de Elite',
  description: 'Saiba como protegemos seus dados na plataforma Prompt de Elite.',
}

export default function PoliticaDePrivacidade() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c1c3f] to-[#2477e0]/10 flex flex-col items-center py-10 px-4">
      <div className="max-w-3xl w-full bg-white/90 shadow-2xl rounded-2xl p-8 md:p-12 flex flex-col gap-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-center text-[#2477e0] mb-2">
          Política de Privacidade
        </h1>
        <p className="text-center text-gray-500 text-sm mb-4">
          Última atualização: 18 de julho de 2025
        </p>

        {/* 1. Quem somos */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-[#0c1c3f] mb-2">1. Quem somos</h2>
          <p>
            Somos o <b>Prompt de Elite</b>, uma plataforma de inteligência artificial dedicada a oferecer uma biblioteca premium de prompts personalizados para criadores, empreendedores e profissionais.
          </p>
          <p className="mt-2">
            Nosso site: <a href="https://promptdeelite.com" target="_blank" rel="noopener" className="text-[#2477e0] underline">promptdeelite.com</a>
          </p>
        </section>

        {/* 2. Quais dados coletamos */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-[#0c1c3f] mb-2">2. Quais dados coletamos</h2>
          <ul className="list-disc list-inside space-y-1">
            <li><b>Nome e e-mail</b> (via login Google)</li>
            <li><b>Informações de navegação anônimas</b> (cookies e analytics)</li>
            <li><b>Preferências de uso</b> (favoritos, respostas em quizzes, feedbacks)</li>
          </ul>
        </section>

        {/* 3. Como usamos seus dados */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-[#0c1c3f] mb-2">3. Como usamos seus dados</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Permitir seu login seguro</li>
            <li>Personalizar sua experiência na biblioteca de prompts</li>
            <li>Enviar comunicações relevantes (eBooks, atualizações)</li>
            <li>Analisar o uso para melhorias contínuas</li>
          </ul>
          <p className="mt-2 font-semibold text-[#2477e0]">Não vendemos seus dados. Nunca.</p>
        </section>

        {/* 4. Com quem compartilhamos seus dados */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-[#0c1c3f] mb-2">4. Com quem compartilhamos seus dados</h2>
          <p>Seus dados são processados com segurança por parceiros de confiança:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><b>Firebase (Google):</b> autenticação e banco de dados</li>
            <li><b>Stripe:</b> processamento de pagamentos</li>
            <li><b>Ferramentas de e-mail (MailerLite, Resend):</b> envio de conteúdos e avisos</li>
          </ul>
        </section>

        {/* 5. Cookies */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-[#0c1c3f] mb-2">5. Cookies</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Guardar sua sessão ativa</li>
            <li>Analisar comportamento de navegação (Google Analytics)</li>
          </ul>
          <p className="mt-2">Você pode desativar os cookies no seu navegador a qualquer momento.</p>
        </section>

        {/* 6. Segurança */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-[#0c1c3f] mb-2">6. Segurança</h2>
          <p>
            Adotamos as melhores práticas para proteger seus dados, com criptografia, autenticação e infraestrutura segura (Google Cloud Platform e Firebase).
          </p>
        </section>

        {/* 7. Seus direitos */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-[#0c1c3f] mb-2">7. Seus direitos</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Solicitar exclusão dos seus dados</li>
            <li>Atualizar e-mail ou preferências</li>
            <li>Cancelar qualquer comunicação por e-mail</li>
          </ul>
          <p className="mt-2">
            Para exercer seus direitos, envie um e-mail para:{" "}
            <a href="mailto:contato@promptdeelite.com" className="text-[#2477e0] underline">contato@promptdeelite.com</a>
          </p>
        </section>

        {/* 8. Contato */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-[#0c1c3f] mb-2">8. Contato</h2>
          <p>
            Tem dúvidas sobre esta política?<br />
            Fale com a nossa equipe:<br />
            <span className="inline-block mt-1 text-[#2477e0] font-semibold">📧 contato@promptdeelite.com</span>
          </p>
        </section>
      </div>
    </div>
  )
}
