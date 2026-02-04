'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { UserMenu } from './user-menu';
import { AgentSelector } from './agent-selector';
import { ConversationList } from './conversation-list';

// Dados mock para desenvolvimento
const mockAgents = [
  {
    id: 'agent-1',
    name: 'PRD Generator',
    slug: 'prd-generator',
    description: 'Gera Product Requirements Documents completos',
  },
  {
    id: 'agent-2',
    name: 'Escopo Comercial',
    slug: 'escopo-comercial',
    description: 'Gera escopos comerciais para propostas',
  },
  {
    id: 'agent-3',
    name: 'Escopo Técnico',
    slug: 'escopo-tecnico',
    description: 'Gera escopos técnicos para desenvolvimento',
  },
];

const mockConversations = [
  {
    id: 'conv-1',
    title: 'PRD do App de Delivery',
    updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    agent: { name: 'PRD Generator', slug: 'prd-generator' },
  },
  {
    id: 'conv-2',
    title: 'Proposta Sistema ERP',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    agent: { name: 'Escopo Comercial', slug: 'escopo-comercial' },
  },
  {
    id: 'conv-3',
    title: 'Arquitetura Microserviços',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    agent: { name: 'Escopo Técnico', slug: 'escopo-tecnico' },
  },
  {
    id: 'conv-4',
    title: 'PRD Plataforma de Cursos Online',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    agent: { name: 'PRD Generator', slug: 'prd-generator' },
  },
];

export function Sidebar() {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(mockAgents[0].id);
  const [activeConversationId, setActiveConversationId] = useState<string>('conv-1');

  const handleNewConversation = () => {
    // TODO: Criar nova conversa
    console.log('Nova conversa com agente:', selectedAgentId);
  };

  return (
    <aside className="w-[280px] h-screen flex flex-col bg-gray-50 border-r border-gray-200">
      {/* Header - Logo */}
      <div className="px-4 py-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-900">Nexia PRD</h1>
            <p className="text-xs text-gray-500">Gerador de Docs</p>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-200" />

      {/* User Menu */}
      <div className="px-3 py-3">
        <UserMenu />
      </div>

      <Separator className="bg-gray-200" />

      {/* Nova Conversa + Agent Selector */}
      <div className="px-4 py-4 space-y-4">
        <Button
          variant="outline"
          className="w-full h-10 justify-start gap-2 rounded-lg border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-colors duration-150"
          onClick={handleNewConversation}
        >
          <span className="text-lg">✨</span>
          <span className="font-medium">Nova Conversa</span>
        </Button>

        <AgentSelector
          agents={mockAgents}
          selectedAgentId={selectedAgentId}
          onSelect={setSelectedAgentId}
        />
      </div>

      <Separator className="bg-gray-200" />

      {/* Histórico Label */}
      <div className="px-5 pt-4 pb-2">
        <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
          Histórico
        </span>
      </div>

      {/* Conversation List */}
      <ConversationList
        conversations={mockConversations}
        activeConversationId={activeConversationId}
        onSelect={setActiveConversationId}
      />

      {/* Footer */}
      <div className="mt-auto">
        <Separator className="bg-gray-200" />
        <div className="px-3 py-3 space-y-1">
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-150">
            <span>⚙️</span>
            <span>Configurações</span>
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-150">
            <span>🚪</span>
            <span>Sair</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
