'use client';

import { useState, useEffect } from 'react';
import { WelcomeScreen } from '@/components/welcome';
import { ChatContainer } from '@/components/chat';

// Dados mock para desenvolvimento
const mockAgents = [
  {
    id: 'agent-1',
    name: 'PRD Generator',
    slug: 'prd-generator',
    description: 'Gera Product Requirements Documents completos e profissionais',
  },
  {
    id: 'agent-2',
    name: 'Escopo Comercial',
    slug: 'escopo-comercial',
    description: 'Cria propostas comerciais detalhadas para projetos',
  },
  {
    id: 'agent-3',
    name: 'Escopo Técnico',
    slug: 'escopo-tecnico',
    description: 'Desenvolve documentação técnica completa para desenvolvimento',
  },
];

interface Conversation {
  id: string;
  agentId: string;
}

export default function ChatPage() {
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    setUserName(localStorage.getItem('nexia-user-name') || 'Usuario');
  }, []);

  const handleSelectAgent = async (agentId: string) => {
    // Para teste, criar uma conversa mock
    // TODO: Integrar com a API para criar conversa real
    const mockConversationId = `conv-${Date.now()}`;
    setActiveConversation({
      id: mockConversationId,
      agentId,
    });
  };

  const handleExport = () => {
    // TODO: Implementar exportação de documento
    console.log('Exportar documento');
  };

  // Se não há conversa ativa, mostra a tela de boas-vindas
  if (!activeConversation) {
    return (
      <WelcomeScreen
        userName={userName}
        agents={mockAgents}
        onSelectAgent={handleSelectAgent}
      />
    );
  }

  // Encontrar o agente da conversa ativa
  const activeAgent = mockAgents.find((a) => a.id === activeConversation.agentId);

  if (!activeAgent) {
    return (
      <WelcomeScreen
        userName={userName}
        agents={mockAgents}
        onSelectAgent={handleSelectAgent}
      />
    );
  }

  return (
    <ChatContainer
      conversationId={activeConversation.id}
      agent={activeAgent}
      onExport={handleExport}
    />
  );
}
