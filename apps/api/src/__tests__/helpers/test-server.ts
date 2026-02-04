import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { registerRoutes } from '../../routes/index.js';

export async function buildTestServer(): Promise<FastifyInstance> {
  const fastify = Fastify({
    logger: false,
  });

  await fastify.register(cors, {
    origin: true,
    credentials: true,
  });

  await fastify.register(registerRoutes, { prefix: '/api' });

  return fastify;
}
