import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { buildTestServer } from './helpers/test-server.js';
import type { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma.js';

describe('Conversations Routes', () => {
  let server: FastifyInstance;
  let testAgentId: string;

  beforeAll(async () => {
    server = await buildTestServer();
    await server.ready();

    // Criar agente de teste
    const agent = await prisma.agent.upsert({
      where: { slug: 'test-conversation-agent' },
      update: {},
      create: {
        name: 'Test Conversation Agent',
        slug: 'test-conversation-agent',
        description: 'Agente para testes de conversas',
        systemPrompt: 'Você é um agente de testes para conversas.',
      },
    });
    testAgentId = agent.id;
  });

  afterAll(async () => {
    // Limpar dados de teste
    await prisma.conversation.deleteMany({
      where: {
        agent: { slug: 'test-conversation-agent' },
      },
    });
    await server.close();
    await prisma.$disconnect();
  });

  describe('POST /api/conversations', () => {
    it('should create a new conversation', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/conversations',
        payload: {
          agentId: testAgentId,
        },
      });

      expect(response.statusCode).toBe(201);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data).toHaveProperty('id');
      expect(body.data.title).toBe('Nova conversa');
      expect(body.data.agentId).toBe(testAgentId);
    });

    it('should return 400 for missing agentId', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/conversations',
        payload: {},
      });

      expect(response.statusCode).toBe(400);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
    });

    it('should return 404 for non-existent agent', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/conversations',
        payload: {
          agentId: 'non-existent-agent-id',
        },
      });

      expect(response.statusCode).toBe(404);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Agente não encontrado');
    });
  });

  describe('GET /api/conversations', () => {
    beforeEach(async () => {
      // Criar uma conversa de teste
      await prisma.user.upsert({
        where: { id: 'test-user-id-12345' },
        update: {},
        create: {
          id: 'test-user-id-12345',
          name: 'Test User',
          email: 'test@example.com',
          password: 'test-password-hash',
        },
      });

      await prisma.conversation.create({
        data: {
          title: 'Conversa de teste para listagem',
          userId: 'test-user-id-12345',
          agentId: testAgentId,
        },
      });
    });

    it('should return a list of conversations', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/conversations',
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.data.length).toBeGreaterThan(0);

      const conversation = body.data[0];
      expect(conversation).toHaveProperty('id');
      expect(conversation).toHaveProperty('title');
      expect(conversation).toHaveProperty('agent');
      expect(conversation).toHaveProperty('_count');
    });
  });

  describe('GET /api/conversations/:id', () => {
    let testConversationId: string;

    beforeEach(async () => {
      const conversation = await prisma.conversation.create({
        data: {
          title: 'Conversa de teste para detalhes',
          userId: 'test-user-id-12345',
          agentId: testAgentId,
        },
      });
      testConversationId = conversation.id;

      // Adicionar uma mensagem
      await prisma.message.create({
        data: {
          role: 'user',
          content: 'Mensagem de teste',
          conversationId: testConversationId,
        },
      });
    });

    it('should return a conversation with messages and documents', async () => {
      const response = await server.inject({
        method: 'GET',
        url: `/api/conversations/${testConversationId}`,
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.id).toBe(testConversationId);
      expect(body.data).toHaveProperty('agent');
      expect(body.data).toHaveProperty('messages');
      expect(body.data).toHaveProperty('documents');
      expect(Array.isArray(body.data.messages)).toBe(true);
      expect(body.data.messages.length).toBeGreaterThan(0);
    });

    it('should return 404 for non-existent conversation', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/conversations/non-existent-id',
      });

      expect(response.statusCode).toBe(404);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error).toBe('Conversa não encontrada');
    });
  });

  describe('DELETE /api/conversations/:id', () => {
    let testConversationId: string;

    beforeEach(async () => {
      const conversation = await prisma.conversation.create({
        data: {
          title: 'Conversa para deletar',
          userId: 'test-user-id-12345',
          agentId: testAgentId,
        },
      });
      testConversationId = conversation.id;
    });

    it('should delete a conversation', async () => {
      const response = await server.inject({
        method: 'DELETE',
        url: `/api/conversations/${testConversationId}`,
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.message).toBe('Conversa deletada com sucesso');

      // Verificar se foi realmente deletada
      const deleted = await prisma.conversation.findUnique({
        where: { id: testConversationId },
      });
      expect(deleted).toBeNull();
    });

    it('should return 404 for non-existent conversation', async () => {
      const response = await server.inject({
        method: 'DELETE',
        url: '/api/conversations/non-existent-id',
      });

      expect(response.statusCode).toBe(404);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
    });
  });
});
