'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Agent {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface AgentSelectorProps {
  agents: Agent[];
  selectedAgentId?: string;
  onSelect: (agentId: string) => void;
}

const agentIcons: Record<string, string> = {
  'prd-generator': '📋',
  'escopo-comercial': '💼',
  'escopo-tecnico': '⚙️',
};

export function AgentSelector({ agents, selectedAgentId, onSelect }: AgentSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium uppercase tracking-wider text-gray-500 px-1">
        Agente
      </label>
      <Select value={selectedAgentId} onValueChange={onSelect}>
        <SelectTrigger className="w-full h-11 bg-white border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-150 focus:ring-2 focus:ring-gray-200 focus:ring-offset-0">
          <SelectValue placeholder="Selecione um agente" />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-gray-200 shadow-lg">
          {agents.map((agent) => (
            <SelectItem
              key={agent.id}
              value={agent.id}
              className="rounded-lg cursor-pointer focus:bg-gray-100"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{agentIcons[agent.slug] || '🤖'}</span>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">{agent.name}</span>
                  <span className="text-xs text-gray-500 line-clamp-1">{agent.description}</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
