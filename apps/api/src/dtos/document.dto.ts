import { z } from 'zod';
import {
  createDocumentSchema,
  documentResponseSchema,
  documentTypeSchema,
  generateDocumentSchema,
} from '../schemas/document.schema.js';

export type DocumentType = z.infer<typeof documentTypeSchema>;
export type GenerateDocumentDTO = z.infer<typeof generateDocumentSchema>;
export type CreateDocumentDTO = z.infer<typeof createDocumentSchema>;
export type DocumentResponseDTO = z.infer<typeof documentResponseSchema>;
