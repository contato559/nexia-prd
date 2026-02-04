'use client';

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
  agent: {
    name: string;
    slug: string;
  };
}

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onSelect: (conversationId: string) => void;
}

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Agora';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}min`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}sem`;
  }

  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

const agentIcons: Record<string, string> = {
  'prd-generator': '📋',
  'escopo-comercial': '💼',
  'escopo-tecnico': '⚙️',
};

export function ConversationList({
  conversations,
  activeConversationId,
  onSelect,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <p className="text-sm text-gray-400 text-center">
          Nenhuma conversa ainda.
          <br />
          Comece uma nova!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-1 px-2">
        {conversations.map((conversation) => {
          const isActive = conversation.id === activeConversationId;

          return (
            <button
              key={conversation.id}
              onClick={() => onSelect(conversation.id)}
              className={`
                w-full text-left px-3 py-2.5 rounded-lg
                transition-colors duration-150
                group
                ${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'}
              `}
            >
              <div className="flex items-start gap-2">
                <span className="text-sm mt-0.5 opacity-70">
                  {agentIcons[conversation.agent.slug] || '💬'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate ${isActive ? 'font-medium' : 'font-normal'}`}>
                    {conversation.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatRelativeDate(conversation.updatedAt)}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
