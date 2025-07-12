'use client';

import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, Target, Database, Cpu, Network, TrendingUp, Atom, Rocket } from 'lucide-react'; // Mais ícones para variedade

// --- Passo a passo: As Etapas da Análise da IA ---
// 1. O que são os 'analysisSteps'?
// Imagine que a IA está seguindo um roteiro para analisar suas respostas.
// Esta lista define cada "passo" desse roteiro, com um ícone, um texto e uma cor.
// Adicionei mais ícones para ter mais dinamismo na tela.
const analysisSteps = [
  {
    icon: Brain, // Ícone do cérebro
    text: "Analisando suas respostas...",
    color: "text-blue-400",
    description: "Processando padrões comportamentais complexos"
  },
  {
    icon: Target, // Ícone de alvo
    text: "Identificando seu perfil...",
    color: "text-green-400",
    description: "Mapeando suas necessidades e objetivos únicos"
  },
  {
    icon: Database, // Ícone de banco de dados
    text: "Consultando nossa biblioteca de prompts...",
    color: "text-purple-400",
    description: "Acessando milhares de prompts otimizados"
  },
  {
    icon: Sparkles, // Ícone de brilho
    text: "Gerando recomendações personalizadas...",
    color: "text-yellow-400",
    description: "Criando sua estratégia de IA exclusiva"
  },
  {
    icon: Atom, // Novo ícone de átomo para mais tecnologia
    text: "Sintetizando insights finais...",
    color: "text-orange-400",
    description: "Compilando as melhores táticas para você"
  },
  {
    icon: Rocket, // Novo ícone de foguete para a etapa final
    text: "Finalizando sua análise ultra-personalizada!",
    color: "text-pink-400",
    description: "Quase pronto para você decolar!"
  }
];

export default function QuizAnalyzing() {
  // --- Passo a passo: Gerenciando as Animações ---
  // 2. 'useState' para controlar o que muda na tela:
  // - `currentStep`: Qual etapa da análise estamos mostrando agora.
  // - `progress`: A porcentagem da barra de progresso.
  // - `dataPoints`: Quantos "pontos de dados" estamos "analisando".
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dataPoints, setDataPoints] = useState(0); // Para o contador de dados

  // --- Passo a passo: Iniciando as Animações Automaticamente ---
  // 3. 'useEffect' para os intervalos de tempo:
  // Assim que a página aparece, ele começa a mudar as etapas, o progresso e os pontos de dados
  // automaticamente, dando a sensação de que algo real está acontecendo.
  useEffect(() => {
    // Animação das etapas (muda a cada 800 milissegundos)
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % analysisSteps.length);
    }, 800);

    // Animação do progresso (aumenta o percentual a cada 45 milissegundos)
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 99) { // Chega perto de 100 mas não 100 exato, para ter a "finalização"
          clearInterval(progressInterval);
          return 99; // Mantém em 99% para a finalização manual ou por um evento
        }
        return prev + 1.5;
      });
    }, 45);

    // Contador de pontos de dados (aumenta aleatoriamente a cada 100 milissegundos)
    const dataInterval = setInterval(() => {
      setDataPoints(prev => {
        if (prev >= 1247) { // Limite máximo para o contador de dados
          clearInterval(dataInterval);
          return 1247;
        }
        return prev + Math.floor(Math.random() * 50) + 10; // Adiciona um número aleatório
      });
    }, 100);

    // Limpa os intervalos quando o componente não está mais na tela, para evitar erros
    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      clearInterval(dataInterval);
    };
  }, []); // O array vazio significa que só roda uma vez, quando o componente "nasce"

  const currentAnalysis = analysisSteps[currentStep]; // Pega a informação da etapa atual

  // --- Passo a passo: A Tela de Análise ---
  // 4. O que vemos enquanto a IA está "pensando"?
  return (
    <div className="max-w-3xl mx-auto text-center space-y-8 animate-in fade-in-50 duration-700 relative">
      {/* Partículas de fundo em movimento */}
      {/* São pequenos pontos que voam na tela, dando um efeito de tecnologia. */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => ( // Aumentei o número de partículas
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`, // Posição aleatória na horizontal
              top: `${Math.random() * 100}%`,   // Posição aleatória na vertical
              animationDelay: `${Math.random() * 2}s`, // Começa em tempos diferentes
              animationDuration: `${2 + Math.random() * 2}s`, // Dura tempos diferentes
              opacity: `${0.3 + Math.random() * 0.7}` // Opacidade variada
            }}
          />
        ))}
      </div>

      {/* Título principal */}
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">
          <span className="bg-gradient-to-r from-white via-[#38bdf8] to-white bg-clip-text text-transparent">
            Analisando seu Perfil
          </span>
        </h1>
        <p className="text-xl text-gray-300">
          Nossa IA está processando suas respostas para criar a estratégia perfeita para você.
        </p>
      </div>

      {/* Ícone principal com animações complexas */}
      {/* Este é o "cérebro" animado que gira e pulsa. */}
      <div className="flex justify-center">
        <div className="relative">
          {/* Ícone central, mudando com a etapa */}
          <div className="w-40 h-40 bg-gradient-to-r from-[#2477e0] via-[#38bdf8] to-[#2477e0] rounded-full flex items-center justify-center shadow-2xl">
            <currentAnalysis.icon className={`w-20 h-20 ${currentAnalysis.color} transition-all duration-500 animate-pulse`} />
          </div>

          {/* Anéis animados múltiplos */}
          {/* Vários anéis que giram em velocidades e direções diferentes. */}
          <div className="absolute inset-0 w-40 h-40 border-4 border-white/20 rounded-full animate-spin"></div>
          <div className="absolute inset-2 w-36 h-36 border-2 border-[#38bdf8]/30 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
          <div className="absolute inset-4 w-32 h-32 border-2 border-[#2477e0]/20 rounded-full animate-spin" style={{ animationDuration: '4s' }}></div>

          {/* Pontos orbitais */}
          {/* Pequenos pontos que orbitam o ícone central. */}
          {[...Array(8)].map((_, i) => ( // Aumentei o número de pontos orbitais
            <div
              key={i}
              className="absolute w-3 h-3 bg-[#38bdf8] rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${i * (360 / 8)}deg) translateY(-80px)`, // Distribuição mais uniforme
                animation: 'spin 2s linear infinite'
              }}
            />
          ))}

          {/* Efeito de brilho em volta do ícone */}
          <div className="absolute inset-0 w-40 h-40 bg-gradient-to-r from-[#2477e0] to-[#38bdf8] rounded-full blur-2xl opacity-30 animate-pulse"></div>
        </div>
      </div>

      {/* Texto da análise atual */}
      <div className="space-y-3">
        <h2 className="text-2xl md:text-3xl font-bold text-white transition-all duration-500">
          {currentAnalysis.text}
        </h2>
        <p className="text-gray-400 text-lg transition-all duration-500">
          {currentAnalysis.description}
        </p>
      </div>

      {/* Métricas em tempo real */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <Cpu className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{dataPoints}</div>
          <div className="text-xs text-gray-400">Pontos de Dados</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <Network className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">4</div>
          <div className="text-xs text-gray-400">Modelos de IA</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <TrendingUp className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">98.7%</div> {/* Precisão ajustada */}
          <div className="text-xs text-gray-400">Precisão</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <Sparkles className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{Math.round(progress)}%</div>
          <div className="text-xs text-gray-400">Concluído</div>
        </div>
      </div>

      {/* Barra de progresso avançada */}
      <div className="space-y-4">
        <div className="relative">
          <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-[#2477e0] via-[#38bdf8] to-[#2477e0] transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Efeito de onda na barra (como um brilho que se move) */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
              <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white/20 to-transparent"></div>
            </div>
          </div>
          {/* Brilho em volta da barra de progresso */}
          <div className="absolute inset-0 h-4 bg-gradient-to-r from-[#2477e0] to-[#38bdf8] rounded-full blur-lg opacity-40"></div>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Analisando padrões comportamentais e cognitivos...</span> {/* Texto mais elaborado */}
          <span className="text-[#38bdf8] font-bold">{progress.toFixed(1)}%</span>
        </div>
      </div>

      {/* Etapas do processo (aquelas caixinhas coloridas embaixo) */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4"> {/* Ajustado para 6 colunas */}
        {analysisSteps.map((step, index) => {
          const StepIcon = step.icon; // Pega o ícone certo para a etapa
          return (
            <div
              key={index}
              className={`p-4 rounded-xl border transition-all duration-500 ${
                index === currentStep
                  ? 'border-[#38bdf8] bg-[#38bdf8]/20 scale-105 shadow-lg shadow-[#38bdf8]/30' // Etapa atual, mais destacada
                  : index < currentStep
                  ? 'border-green-500/30 bg-green-500/10' // Etapa já passada, verde de "concluído"
                  : 'border-white/20 bg-white/5' // Próximas etapas, menos destacadas
              }`}
            >
              <StepIcon className={`w-8 h-8 mx-auto mb-2 transition-all duration-500 ${
                index === currentStep ? step.color + ' animate-pulse' // Ícone da etapa atual pulsa e tem cor
                  : index < currentStep ? 'text-green-400' // Ícone da etapa passada fica verde
                    : 'text-gray-400' // Ícone da próxima etapa fica cinza
              }`} />
              <div className={`text-xs font-medium text-center transition-all duration-500 ${
                index === currentStep ? 'text-white'
                  : index < currentStep ? 'text-green-400'
                    : 'text-gray-400'
              }`}>
                Etapa {index + 1}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mensagem de aguardo premium */}
      <div className="relative">
        <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-[#38bdf8] rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            <span className="text-white font-medium text-lg">
              Preparando seu resultado personalizado...
            </span>
          </div>
        </div>
        {/* Efeito de brilho em volta da caixa de mensagem */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2477e0]/20 to-[#38bdf8]/20 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
      </div>
    </div>
  );
}