import { z } from 'zod';
import {
  createConversationSchema,
  updateConversationSchema,
  conversationResponseSchema,
  conversationWithRelationsSchema,
} from '../schemas/conversation.schema.js';

export type CreateConversationDTO = z.infer<typeof createConversationSchema>;
export type UpdateConversationDTO = z.infer<typeof updateConversationSchema>;
export type ConversationResponseDTO = z.infer<typeof conversationResponseSchema>;
export type ConversationWithRelationsDTO = z.infer<typeof conversationWithRelationsSchema>;
