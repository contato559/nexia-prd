import { z } from 'zod';

export const messageRoleSchema = z.enum(['user', 'assistant']);

export const createMessageSchema = z.object({
  role: messageRoleSchema,
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  conversationId: z.string().cuid('ID da conversa inválido'),
});

export const messageResponseSchema = z.object({
  id: z.string(),
  role: messageRoleSchema,
  content: z.string(),
  conversationId: z.string(),
  createdAt: z.date(),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Conteúdo é obrigatório'),
});
