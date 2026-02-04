import { z } from 'zod';

export const documentTypeSchema = z.enum(['docx', 'pdf']);

export const generateDocumentSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  type: documentTypeSchema,
});

export const createDocumentSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  type: documentTypeSchema,
  url: z.string().min(1, 'URL é obrigatória'),
  conversationId: z.string().min(1, 'ID da conversa é obrigatório'),
});

export const documentResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: documentTypeSchema,
  url: z.string(),
  conversationId: z.string(),
  createdAt: z.date(),
});

export const documentListResponseSchema = z.array(documentResponseSchema);
