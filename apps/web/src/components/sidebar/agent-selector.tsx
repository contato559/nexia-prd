'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AgentIcon } from '@/components/icons';

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

export function AgentSelector({ agents, selectedAgentId, onSelect }: AgentSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground px-1">
        Agente
      </label>
      <Select value={selectedAgentId} onValueChange={onSelect}>
        <SelectTrigger className="w-full h-10 bg-background border-border rounded-lg hover:border-muted-foreground/30 transition-colors focus:ring-2 focus:ring-primary/20 focus:ring-offset-0">
          <SelectValue placeholder="Selecione um agente" />
        </SelectTrigger>
        <SelectContent className="rounded-lg border-border shadow-lg z-[100]" position="popper" sideOffset={4}>
          {agents.map((agent) => (
            <SelectItem
              key={agent.id}
              value={agent.id}
              className="rounded-lg cursor-pointer focus:bg-accent"
            >
              <div className="flex items-center gap-2">
                <AgentIcon slug={agent.slug} className="w-4 h-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">{agent.name}</span>
                  <span className="text-xs text-muted-foreground line-clamp-1">{agent.description}</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
