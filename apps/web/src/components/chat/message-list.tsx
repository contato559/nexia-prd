'use client';

import { useEffect, useRef } from 'react';
import { MessageBubble, TypingIndicator } from './message-bubble';

interface Document {
  id: string;
  name: string;
  type: 'docx' | 'pdf';
  url: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  documents?: Document[];
}

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  streamingContent?: string;
}

export function MessageList({ messages, isLoading, streamingContent }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para o final quando novas mensagens chegam
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-3xl mx-auto">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            role={message.role}
            content={message.content}
            documents={message.documents}
          />
        ))}

        {/* Mensagem sendo streamada */}
        {streamingContent && (
          <MessageBubble role="assistant" content={streamingContent} isStreaming={true} />
        )}

        {/* Indicador de digitando (quando não há conteúdo ainda) */}
        {isLoading && !streamingContent && <TypingIndicator />}

        {/* Referência para scroll automático */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
