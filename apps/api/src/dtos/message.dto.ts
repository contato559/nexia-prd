import { z } from 'zod';
import {
  createMessageSchema,
  messageResponseSchema,
  sendMessageSchema,
  messageRoleSchema,
} from '../schemas/message.schema.js';

export type MessageRole = z.infer<typeof messageRoleSchema>;
export type CreateMessageDTO = z.infer<typeof createMessageSchema>;
export type MessageResponseDTO = z.infer<typeof messageResponseSchema>;
export type SendMessageDTO = z.infer<typeof sendMessageSchema>;
