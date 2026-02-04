'use client';

import { AgentShortcutCard } from './agent-shortcut-card';

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
        {/* Ícone sutil */}
        <div className="text-4xl mb-4 opacity-80">✨</div>

        {/* Saudação */}
        <h1 className="text-3xl font-semibold text-gray-900">Olá, {firstName}</h1>

        {/* Subtítulo */}
        <p className="text-base text-gray-500 mt-2">
          Selecione um agente para começar a criar documentos com IA.
        </p>

        {/* Grid de agentes */}
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
