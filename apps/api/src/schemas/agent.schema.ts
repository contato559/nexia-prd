import { z } from 'zod';

export const createAgentSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  slug: z
    .string()
    .min(2, 'Slug deve ter pelo menos 2 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  systemPrompt: z.string().min(20, 'System prompt deve ter pelo menos 20 caracteres'),
});

export const updateAgentSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  slug: z
    .string()
    .min(2, 'Slug deve ter pelo menos 2 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens')
    .optional(),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres').optional(),
  systemPrompt: z.string().min(20, 'System prompt deve ter pelo menos 20 caracteres').optional(),
});

export const agentResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  systemPrompt: z.string(),
  createdAt: z.date(),
});
