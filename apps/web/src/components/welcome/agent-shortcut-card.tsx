'use client';

import { AgentIcon } from '@/components/icons';

interface AgentShortcutCardProps {
  id: string;
  name: string;
  slug: string;
  description: string;
  onSelect: (agentId: string) => void;
}

export function AgentShortcutCard({
  id,
  name,
  slug,
  description,
  onSelect,
}: AgentShortcutCardProps) {
  return (
    <button
      onClick={() => onSelect(id)}
      className="
        bg-background border border-border rounded-lg p-6
        hover:shadow-md hover:border-primary/30
        transition-all cursor-pointer
        text-left w-full
        group
      "
    >
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <AgentIcon slug={slug} className="w-5 h-5 text-primary" />
      </div>
      <h3 className="font-semibold text-foreground mb-1">{name}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </button>
  );
}
