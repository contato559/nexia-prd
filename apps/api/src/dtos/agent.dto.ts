import { z } from 'zod';
import {
  createAgentSchema,
  updateAgentSchema,
  agentResponseSchema,
} from '../schemas/agent.schema.js';

export type CreateAgentDTO = z.infer<typeof createAgentSchema>;
export type UpdateAgentDTO = z.infer<typeof updateAgentSchema>;
export type AgentResponseDTO = z.infer<typeof agentResponseSchema>;
