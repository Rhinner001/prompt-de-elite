// types/index.ts

// NOVO: Definimos a estrutura de um único campo personalizável
export interface PromptField {
  name: string;
  label: string;
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  category: string;
  prompt_template: string;
  // AGORA USAMOS NOSSO NOVO TIPO
  fields: PromptField[]; // <<< MODIFICADO: De 'any[]' para 'PromptField[]'
  use_case: string;
  tags: string[];
  version: number;
  createdAt: number;
}