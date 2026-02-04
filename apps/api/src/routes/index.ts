import type { FastifyInstance } from 'fastify';
import { agentsRoutes } from './agents.routes.js';
import { conversationsRoutes } from './conversations.routes.js';
import { documentsRoutes } from './documents.routes.js';

export async function registerRoutes(fastify: FastifyInstance) {
  await fastify.register(agentsRoutes);
  await fastify.register(conversationsRoutes);
  await fastify.register(documentsRoutes);
}
