'use client';

import { useState, useCallback, useEffect } from 'react';
import { api } from '@/lib/api';

interface Agent {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface Conversation {
  id: string;
  title: string;
  userId: string;
  agentId: string;
  createdAt: string;
  updatedAt: string;
  agent: Agent;
  _count?: {
    messages: number;
  };
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  conversationId: string;
  createdAt: string;
}

interface Document {
  id: string;
  name: string;
  type: 'docx' | 'pdf';
  url: string;
  conversationId: string;
  createdAt: string;
}

interface ConversationWithDetails extends Conversation {
  messages: Message[];
  documents: Document[];
}

interface UseConversationsReturn {
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
  fetchConversations: () => Promise<void>;
  createConversation: (agentId: string) => Promise<Conversation | null>;
  getConversation: (id: string) => Promise<ConversationWithDetails | null>;
  deleteConversation: (id: string) => Promise<boolean>;
}

export function useConversations(): UseConversationsReturn {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<Conversation[]>('/conversations');

      if (response.success && response.data) {
        setConversations(response.data);
      } else {
        setError(response.error || 'Erro ao carregar conversas');
      }
    } catch (err) {
      console.error('Erro ao buscar conversas:', err);
      setError('Erro ao carregar conversas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createConversation = useCallback(async (agentId: string): Promise<Conversation | null> => {
    setError(null);

    try {
      const response = await api.post<Conversation>('/conversations', { agentId });

      if (response.success && response.data) {
        // Adicionar nova conversa no início da lista
        setConversations((prev) => [response.data!, ...prev]);
        return response.data;
      } else {
        setError(response.error || 'Erro ao criar conversa');
        return null;
      }
    } catch (err) {
      console.error('Erro ao criar conversa:', err);
      setError('Erro ao criar conversa');
      return null;
    }
  }, []);

  const getConversation = useCallback(
    async (id: string): Promise<ConversationWithDetails | null> => {
      try {
        const response = await api.get<ConversationWithDetails>(`/conversations/${id}`);

        if (response.success && response.data) {
          return response.data;
        }

        return null;
      } catch (err) {
        console.error('Erro ao buscar conversa:', err);
        return null;
      }
    },
    []
  );

  const deleteConversation = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await api.delete(`/conversations/${id}`);

      if (response.success) {
        setConversations((prev) => prev.filter((c) => c.id !== id));
        return true;
      }

      return false;
    } catch (err) {
      console.error('Erro ao deletar conversa:', err);
      return false;
    }
  }, []);

  // Carregar conversas na montagem
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    isLoading,
    error,
    fetchConversations,
    createConversation,
    getConversation,
    deleteConversation,
  };
}

// Hook para buscar agentes
interface UseAgentsReturn {
  agents: Agent[];
  isLoading: boolean;
  error: string | null;
  fetchAgents: () => Promise<void>;
  getAgent: (slug: string) => Promise<Agent | null>;
}

export function useAgents(): UseAgentsReturn {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<Agent[]>('/agents');

      if (response.success && response.data) {
        setAgents(response.data);
      } else {
        setError(response.error || 'Erro ao carregar agentes');
      }
    } catch (err) {
      console.error('Erro ao buscar agentes:', err);
      setError('Erro ao carregar agentes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAgent = useCallback(async (slug: string): Promise<Agent | null> => {
    try {
      const response = await api.get<Agent>(`/agents/${slug}`);

      if (response.success && response.data) {
        return response.data;
      }

      return null;
    } catch (err) {
      console.error('Erro ao buscar agente:', err);
      return null;
    }
  }, []);

  // Carregar agentes na montagem
  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  return {
    agents,
    isLoading,
    error,
    fetchAgents,
    getAgent,
  };
}
