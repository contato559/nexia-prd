'use client';

import { useState, useCallback, useEffect } from 'react';
import { api } from '@/lib/api';

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
  createdAt?: string;
}

interface UseChatOptions {
  conversationId: string;
  initialMessages?: Message[];
  onError?: (error: Error) => void;
  onTitleUpdate?: (title: string) => void;
}

interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  streamingContent: string;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  setMessages: (messages: Message[]) => void;
}

export function useChat({
  conversationId,
  initialMessages = [],
  onError,
  onTitleUpdate,
}: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');

  // Atualizar mensagens quando initialMessages mudar
  useEffect(() => {
    if (initialMessages.length > 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const trimmedContent = content.trim();

      // Adicionar mensagem do usuário
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmedContent,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setStreamingContent('');

      // Verificar se é a primeira mensagem para atualizar título
      const isFirstMessage = messages.length === 0;

      try {
        const response = await fetch(
          api.getStreamUrl(`/conversations/${conversationId}/messages`),
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: trimmedContent }),
          }
        );

        if (!response.ok) {
          throw new Error('Erro ao enviar mensagem');
        }

        // Processar SSE stream
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error('Stream não disponível');
        }

        let fullContent = '';
        let assistantMessageId = '';
        let streamDone = false;

        while (!streamDone) {
          const { done, value } = await reader.read();

          if (done) {
            streamDone = true;
            continue;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6).trim();
              if (!jsonStr) continue;

              try {
                const data = JSON.parse(jsonStr);

                switch (data.type) {
                  case 'user_message':
                    // ID da mensagem do usuário salva no backend
                    break;

                  case 'token':
                    fullContent += data.content;
                    setStreamingContent(fullContent);
                    break;

                  case 'complete':
                    assistantMessageId = data.assistantMessageId;
                    break;

                  case 'error':
                    throw new Error(data.message);
                }
              } catch {
                // Ignorar linhas que não são JSON válido
              }
            }
          }
        }

        // Adicionar mensagem do assistente completa
        if (fullContent) {
          const assistantMessage: Message = {
            id: assistantMessageId || `assistant-${Date.now()}`,
            role: 'assistant',
            content: fullContent,
          };

          setMessages((prev) => [...prev, assistantMessage]);

          // Notificar atualização de título se for primeira mensagem
          if (isFirstMessage && onTitleUpdate) {
            const newTitle =
              trimmedContent.length > 50 ? trimmedContent.substring(0, 47) + '...' : trimmedContent;
            onTitleUpdate(newTitle);
          }
        }
      } catch (error) {
        const errorInstance = error instanceof Error ? error : new Error('Erro desconhecido');
        onError?.(errorInstance);

        // Adicionar mensagem de erro
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content:
            'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        setStreamingContent('');
      }
    },
    [conversationId, isLoading, messages.length, onError, onTitleUpdate]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setStreamingContent('');
  }, []);

  return {
    messages,
    isLoading,
    streamingContent,
    sendMessage,
    clearMessages,
    setMessages,
  };
}
