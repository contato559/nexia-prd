'use client';

import { AgentShortcutCard } from './agent-shortcut-card';
import { SparklesIcon } from '@/components/icons';

interface Agent {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface WelcomeScreenProps {
  userName?: string;
  agents: Agent[];
  onSelectAgent: (agentId: string) => void;
}

export function WelcomeScreen({ userName = 'Usuário', agents, onSelectAgent }: WelcomeScreenProps) {
  const firstName = userName.split(' ')[0];

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center max-w-2xl px-4">
        <SparklesIcon className="w-10 h-10 mx-auto mb-4 text-primary/60" />

        <h1 className="text-3xl font-semibold text-foreground">Olá, {firstName}</h1>

        <p className="text-base text-muted-foreground mt-2">
          Selecione um agente para começar a criar documentos com IA.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {agents.map((agent) => (
            <AgentShortcutCard
              key={agent.id}
              id={agent.id}
              name={agent.name}
              slug={agent.slug}
              description={agent.description}
              onSelect={onSelectAgent}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
