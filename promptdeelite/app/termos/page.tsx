// app/termosdeservico/page.tsx

export const metadata = {
  title: 'Termos de Serviço | Prompt de Elite',
  description: 'Veja os termos e condições para uso da plataforma Prompt de Elite.',
}

export default function TermosDeServico() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c1c3f] to-[#2477e0]/10 flex flex-col items-center py-10 px-4">
      <div className="max-w-3xl w-full bg-white/90 shadow-2xl rounded-2xl p-8 md:p-12 flex flex-col gap-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-center text-[#2477e0] mb-2">
          Termo de Serviço
        </h1>
        <p className="text-center text-gray-500 text-sm mb-4">
          Última atualização: 18 de julho de 2025
        </p>

        {/* 1. Aceitação dos Termos */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-[#0c1c3f] mb-2">1. Aceitação dos Termos</h2>
          <p>
            Ao acessar ou utilizar o Prompt de Elite, você concorda com estes Termos de Serviço. Se não concordar, por favor, não utilize a plataforma.
          </p>
        </section>

        {/* 2. Sobre a Plataforma */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-[#0c1c3f] mb-2">2. Sobre a Plataforma</h2>
          <p>
            O Prompt de Elite é uma plataforma online que oferece uma biblioteca premium de prompts otimizados por IA para criadores, profissionais e empreendedores.
          </p>
        </section>

        {/* 3. Cadastro e Acesso */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-[#0c1c3f] mb-2">3. Cadastro e Acesso</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>O acesso é feito por login com Google.</li>
            <li>É necessário fornecer informações verdadeiras e manter seus dados atualizados.</li>
            <li>Não compartilhe seu acesso com terceiros.</li>
          </ul>
        </section>

        {/* 4. Uso da Plataforma */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-[#0c1c3f] mb-2">4. Uso da Plataforma</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Utilize os prompts e recursos apenas para fins lícitos e pessoais/profissionais.</li>
            <li>Não é permitido revender, redistribuir, copiar ou usar os conteúdos para criar plataformas concorrentes.</li>
            <li>Abusos, tentativas de burlar sistemas ou uso para fins ilícitos podem resultar em bloqueio do acesso sem aviso.</li>
          </ul>
        </section>

        {/* 5. Pagamentos e Planos */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-[#0c1c3f] mb-2">5. Pagamentos e Planos</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Algumas funcionalidades podem ser pagas, como planos mensais ou vitalícios.</li>
            <li>Os pagamentos são processados por parceiros seguros (Stripe).</li>
            <li>Não garantimos resultados específicos com o uso dos prompts.</li>
          </ul>
        </section>

        {/* 6. Cancelamento e Reembolso */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-[#0c1c3f] mb-2">6. Cancelamento e Reembolso</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Você pode cancelar sua assinatura a qualquer momento.</li>
            <li>Para reembolsos, siga as políticas descritas na página de checkout ou entre em contato por e-mail.</li>
          </ul>
        </section>

        {/* 7. Propriedade Intelectual */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-[#0c1c3f] mb-2">7. Propriedade Intelectual</h2>
          <p>
            Todo o conteúdo, design, prompts, marca e código pertencem ao Prompt de Elite e não podem ser usados sem autorização prévia.
          </p>
        </section>

        {/* 8. Alterações nos Termos */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-[#0c1c3f] mb-2">8. Alterações nos Termos</h2>
          <p>
            Estes termos podem ser atualizados a qualquer momento. Avisaremos sobre mudanças significativas.
          </p>
        </section>

        {/* 9. Limitação de Responsabilidade */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-[#0c1c3f] mb-2">9. Limitação de Responsabilidade</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>O Prompt de Elite não se responsabiliza por prejuízos decorrentes do uso ou indisponibilidade da plataforma.</li>
            <li>O uso é por sua conta e risco.</li>
          </ul>
        </section>

        {/* 10. Contato */}
        <section>
          <h2 className="font-serif text-xl font-semibold text-[#0c1c3f] mb-2">10. Contato</h2>
          <p>
            Dúvidas? Fale com a nossa equipe:<br />
            <span className="inline-block mt-1 text-[#2477e0] font-semibold">📧 contato@promptdeelite.com</span>
          </p>
        </section>
      </div>
    </div>
  )
}