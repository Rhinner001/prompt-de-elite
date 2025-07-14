/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useCallback, useMemo } from 'react';

interface Question {
  id: number;
  question: string;
  options: string[];
  category: string;
}

const quizQuestions: Question[] = [
  {
    id: 1,
    question: "Qual seu principal objetivo ao usar a IA em seu trabalho ou negócio?",
    options: [
      "Aumentar minhas vendas e conversões com textos e estratégias otimizadas.",
      "Criar conteúdo mais rápido e original para minhas redes sociais/blog.",
      "Automatizar tarefas repetitivas e otimizar processos internos para mais eficiência.",
      "Aprender a fundo e dominar a IA para me destacar no mercado."
    ],
    category: "objetivo"
  },
  {
    id: 2,
    question: "Qual a sua maior frustração ao tentar usar ferramentas de IA hoje?",
    options: [
      "Não sei como formular os prompts certos para ter respostas úteis e específicas.",
      "Perco muito tempo ajustando as respostas da IA, elas são muito genéricas.",
      "Nunca consigo gerar o mesmo nível de qualidade nos resultados de forma consistente.",
      "Tenho medo de que a IA me deixe parecer menos profissional ou criativo."
    ],
    category: "frustração"
  },
  {
    id: 3,
    question: "Como você descreveria sua experiência atual com Inteligência Artificial?",
    options: [
      "Sou iniciante total, mal sei por onde começar.",
      "Já usei algumas vezes, mas meus resultados não foram muito bons.",
      "Uso ocasionalmente, mas sinto que poderia extrair muito mais valor.",
      "Sou um usuário avançado, mas busco aprimorar e refinar minhas habilidades."
    ],
    category: "experiência"
  },
  {
    id: 4,
    question: "Quanto tempo você pode dedicar por semana para aprender e aplicar IA?",
    options: [
      "Menos de 1 hora (preciso de soluções rápidas e prontas).",
      "1 a 3 horas (consigo dedicar um tempo para aprendizado e prática).",
      "3 a 5 horas (quero mergulhar mais fundo e experimentar bastante).",
      "Mais de 5 horas (estou determinado a dominar e explorar todo o potencial)."
    ],
    category: "tempo"
  }
];

export interface UserProfile {
  type: 'conquistador' | 'estrategista' | 'criativo' | 'acelerador';
  title: string;
  description: string;
  benefits: string[];
  challenge: string;
}

const userProfiles: Record<UserProfile['type'], UserProfile> = {
  conquistador: {
    type: 'conquistador',
    title: 'Conquistador de Vendas',
    description: 'Você é um profissional movido a resultados, focado em transformar interações em conversões. Busca na IA uma ferramenta para escalar suas vendas e otimizar cada etapa do funil comercial.',
    benefits: [
      'Prompts validados para copywriting persuasivo e de alta conversão.',
      'Estratégias avançadas de vendas e nutrição de leads via IA.',
      'Modelos prontos para e-mails, anúncios e scripts de vendas.',
      'Automação inteligente de follow-ups e propostas comerciais.'
    ],
    challenge: 'transformar leads em clientes fiéis e lucrativos usando IA estratégica.'
  },
  estrategista: {
    type: 'estrategista',
    title: 'Estrategista Inteligente',
    description: 'Sua mente foca na eficiência e na tomada de decisões assertivas. Você quer usar a IA para desvendar dados complexos, prever tendências e otimizar processos para um impacto duradouro.',
    benefits: [
      'Prompts para análise de dados e geração de insights acionáveis.',
      'Ferramentas de IA para planejamento estratégico e modelagem de negócios.',
      'Relatórios e insights automatizados com foco em métricas chave.',
      'Otimização de recursos e identificação de gargalos com o poder da IA.'
    ],
    challenge: 'otimizar processos e tomar decisões mais inteligentes e rápidas, baseadas em dados precisos.'
  },
  criativo: {
    type: 'criativo',
    title: 'Criativo Inovador',
    description: 'Sua paixão é a criação e a inovação. Você busca na IA uma parceira para expandir sua capacidade criativa, gerar ideias ilimitadas e produzir conteúdo original e envolvente em escala.',
    benefits: [
      'Prompts para desbloquear a criatividade e gerar ideias de conteúdo viral.',
      'Modelos para roteiros, storytelling e desenvolvimento de personagens.',
      'Criação de campanhas de marketing inovadoras e visuais impactantes.',
      'Técnicas de IA para superar bloqueios criativos e explorar novos horizontes.'
    ],
    challenge: 'criar conteúdo original, envolvente e de alta qualidade de forma consistente e escalável.'
  },
  acelerador: {
    type: 'acelerador',
    title: 'Acelerador de Produtividade',
    description: 'Você valoriza cada minuto do seu dia e busca maximizar sua produtividade. A IA é sua aliada para eliminar o trabalho manual, automatizar rotinas e otimizar o tempo para o que realmente importa.',
    benefits: [
      'Prompts para automação de tarefas rotineiras e burocráticas.',
      'Técnicas de IA para otimizar a gestão do tempo e priorização de tarefas.',
      'Templates de comunicação e organização para eficiência máxima.',
      'Ferramentas de IA para sumarização, pesquisa rápida e aprendizado acelerado.'
    ],
    challenge: 'multiplicar sua produtividade e economizar tempo valioso, eliminando tarefas repetitivas.'
  }
};

export const useQuiz = () => {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'question' | 'analyzing' | 'result'>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const startQuiz = useCallback(() => {
    setCurrentStep('question');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setUserProfile(null);
    setIsAnalyzing(false);
  }, []);

  const handleAnswer = useCallback((answerIndex: number) => {
    const newAnswers = { ...answers, [currentQuestionIndex]: answerIndex };
    setAnswers(newAnswers);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCurrentStep('analyzing');
      setIsAnalyzing(true);

      setTimeout(() => {
        const profile = calculateProfile(newAnswers);
        setUserProfile(profile);
        setIsAnalyzing(false);
        setCurrentStep('result');
      }, 3000);
    }
  }, [answers, currentQuestionIndex, quizQuestions.length]); // Added quizQuestions.length as dependency

  const calculateProfile = useCallback((answers: Record<number, number>): UserProfile => {
    const scores = {
      conquistador: 0,
      estrategista: 0,
      criativo: 0,
      acelerador: 0
    };

    if (answers[0] === 0) scores.conquistador += 3;
    if (answers[0] === 1) scores.criativo += 3;
    if (answers[0] === 2) scores.estrategista += 3;
    if (answers[0] === 3) scores.acelerador += 3;

    if (answers[1] === 0) scores.acelerador += 2;
    if (answers[1] === 1) scores.estrategista += 2;
    if (answers[1] === 2) scores.criativo += 2;
    if (answers[1] === 3) scores.conquistador += 2;

    if (answers[2] === 0) scores.acelerador += 1;
    if (answers[2] === 1) scores.criativo += 1;
    if (answers[2] === 2) scores.estrategista += 1;
    if (answers[2] === 3) scores.conquistador += 1;

    if (answers[3] === 0) scores.acelerador += 1;
    if (answers[3] === 1) scores.estrategista += 1;
    if (answers[3] === 2) scores.criativo += 1;
    if (answers[3] === 3) scores.conquistador += 1;

    const maxScore = Math.max(...Object.values(scores));
    const profileType = Object.entries(scores).find(([, score]) => score === maxScore)?.[0] || 'acelerador';

    return userProfiles[profileType as UserProfile['type']];
  }, []); // userProfiles and quizQuestions are constant, so no need to add as dependency

  const currentQuestion = useMemo(() => quizQuestions[currentQuestionIndex], [currentQuestionIndex]);
  const progress = useMemo(() => ((currentQuestionIndex) / quizQuestions.length) * 100, [currentQuestionIndex, quizQuestions.length]);

  return {
    currentStep,
    currentQuestion,
    currentQuestionIndex,
    answers,
    userProfile,
    isAnalyzing,
    progress,
    startQuiz,
    handleAnswer
  };
};

export default useQuiz;