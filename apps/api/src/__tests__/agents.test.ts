import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildTestServer } from './helpers/test-server.js';
import type { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma.js';

describe('Agents Routes', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = await buildTestServer();
    await server.ready();

    // Garantir que existem agentes de teste
    await prisma.agent.upsert({
      where: { slug: 'test-agent' },
      update: {},
      create: {
        name: 'Test Agent',
        slug: 'test-agent',
        description: 'Agente para testes',
        systemPrompt: 'Você é um agente de testes.',
      },
    });
  });

  afterAll(async () => {
    await server.close();
    await prisma.$disconnect();
  });

  describe('GET /api/agents', () => {
    it('should return a list of agents', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/agents',
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.data.length).toBeGreaterThan(0);

      const agent = body.data[0];
      expect(agent).toHaveProperty('id');
      expect(agent).toHaveProperty('name');
      expect(agent).toHaveProperty('slug');
      expect(agent).toHaveProperty('description');
    });
  });

  describe('GET /api/agents/:slug', () => {
    it('should return an agent by slug', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/agents/test-agent',
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.slug).toBe('test-agent');
      expect(body.data.name).toBe('Test Agent');
    });

    it('should return 404 for non-existent agent', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/agents/non-existent-agent',
      });

      expect(response.statusCode).toBe(404);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Agente não encontrado');
    });
  });
});
