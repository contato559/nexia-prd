import { z } from 'zod';

export const createConversationSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  agentId: z.string().cuid('ID do agente inválido'),
});

export const updateConversationSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').optional(),
});

export const conversationResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  userId: z.string(),
  agentId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const conversationWithRelationsSchema = conversationResponseSchema.extend({
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
  }),
  agent: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
  }),
  messages: z.array(
    z.object({
      id: z.string(),
      role: z.string(),
      content: z.string(),
      createdAt: z.date(),
    })
  ),
  documents: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: z.string(),
      url: z.string(),
      createdAt: z.date(),
    })
  ),
});
