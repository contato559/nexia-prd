'use client';

interface AgentShortcutCardProps {
  id: string;
  name: string;
  slug: string;
  description: string;
  onSelect: (agentId: string) => void;
}

const agentIcons: Record<string, string> = {
  'prd-generator': '📋',
  'escopo-comercial': '💼',
  'escopo-tecnico': '⚙️',
};

export function AgentShortcutCard({
  id,
  name,
  slug,
  description,
  onSelect,
}: AgentShortcutCardProps) {
  const icon = agentIcons[slug] || '🤖';

  return (
    <button
      onClick={() => onSelect(id)}
      className="
        bg-white border border-gray-200 rounded-xl p-6
        hover:shadow-md hover:border-gray-300
        transition-all duration-200 cursor-pointer
        text-left w-full
        group
      "
    >
      <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-200">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{name}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </button>
  );
}
