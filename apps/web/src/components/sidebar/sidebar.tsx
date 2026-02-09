'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { UserMenu } from './user-menu';
import { AgentSelector } from './agent-selector';
import { ConversationList } from './conversation-list';
import { useApp } from '@/contexts/app-context';
import { ChatIcon, FolderIcon, SettingsIcon, LogOutIcon } from '@/components/icons';

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
    title: 'Arquitetura Microservicos',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    agent: { name: 'Escopo Tecnico', slug: 'escopo-tecnico' },
  },
  {
    id: 'conv-4',
    title: 'PRD Plataforma de Cursos Online',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    agent: { name: 'PRD Generator', slug: 'prd-generator' },
  },
];

export function Sidebar() {
  const router = useRouter();
  const { activeView, setActiveView } = useApp();
  const [selectedAgentId, setSelectedAgentId] = useState<string>(mockAgents[0].id);
  const [activeConversationId, setActiveConversationId] = useState<string>('conv-1');

  const handleNewConversation = () => {
    setActiveView('chat');
    console.log('Nova conversa com agente:', selectedAgentId);
  };

  const handleLogout = () => {
    localStorage.removeItem('nexia-user-name');
    router.push('/login');
  };

  return (
    <aside className="w-[280px] h-screen flex flex-col bg-secondary border-r border-border">
      {/* Header - Logo */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          <div>
            <h1 className="text-base font-semibold text-foreground">Nexia PRD</h1>
            <p className="text-xs text-muted-foreground">Gerador de Docs</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* User Menu */}
      <div className="px-3 py-3">
        <UserMenu />
      </div>

      <Separator />

      {/* Navigation: Chat / Materiais */}
      <div className="px-3 py-3 flex gap-2">
        <button
          onClick={() => setActiveView('chat')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeView === 'chat'
              ? 'bg-primary text-white'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          <ChatIcon className="w-4 h-4" />
          Chat
        </button>
        <button
          onClick={() => setActiveView('materials')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeView === 'materials'
              ? 'bg-primary text-white'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          <FolderIcon className="w-4 h-4" />
          Materiais
        </button>
      </div>

      <Separator />

      {/* Nova Conversa + Agent Selector */}
      <div className="px-4 py-4 space-y-4">
        <Button
          variant="outline"
          className="w-full h-10 justify-start gap-2 rounded-lg border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 transition-colors"
          onClick={handleNewConversation}
        >
          <span className="text-lg">+</span>
          <span className="font-medium">Nova Conversa</span>
        </Button>

        <AgentSelector
          agents={mockAgents}
          selectedAgentId={selectedAgentId}
          onSelect={setSelectedAgentId}
        />
      </div>

      <Separator />

      {/* Historico Label */}
      <div className="px-5 pt-4 pb-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Historico
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
        <Separator />
        <div className="px-3 py-3 space-y-1">
          <button
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground rounded-lg hover:bg-accent transition-colors"
            aria-label="Configuracoes"
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Configuracoes</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground rounded-lg hover:bg-accent transition-colors"
            aria-label="Sair"
          >
            <LogOutIcon className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
