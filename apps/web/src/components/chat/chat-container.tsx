'use client';

import { ChatHeader } from './chat-header';
import { MessageList } from './message-list';
import { MessageInput } from './message-input';
import { useChat } from '@/hooks/use-chat';

interface Agent {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface ChatContainerProps {
  conversationId: string;
  agent: Agent;
  onExport?: () => void;
}

export function ChatContainer({ conversationId, agent, onExport }: ChatContainerProps) {
  const { messages, isLoading, streamingContent, sendMessage } = useChat({
    conversationId,
    onError: (error) => {
      console.error('Erro no chat:', error);
    },
  });

  return (
    <div className="flex flex-col h-full bg-white">
      <ChatHeader agentName={agent.name} agentDescription={agent.description} onExport={onExport} />

      <MessageList messages={messages} isLoading={isLoading} streamingContent={streamingContent} />

      <MessageInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}
