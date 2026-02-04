import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { buildTestServer } from './helpers/test-server.js';
import type { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma.js';
import * as fs from 'fs';
import * as path from 'path';

describe('Documents Routes', () => {
  let server: FastifyInstance;
  let testAgentId: string;
  let testConversationId: string;

  beforeAll(async () => {
    server = await buildTestServer();
    await server.ready();

    // Criar agente de teste
    const agent = await prisma.agent.upsert({
      where: { slug: 'test-document-agent' },
      update: {},
      create: {
        name: 'Test Document Agent',
        slug: 'test-document-agent',
        description: 'Agente para testes de documentos',
        systemPrompt: 'Você é um agente de testes.',
      },
    });
    testAgentId = agent.id;

    // Criar usuário de teste
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
  });

  beforeEach(async () => {
    // Criar conversa de teste
    const conversation = await prisma.conversation.create({
      data: {
        title: 'Conversa para teste de documentos',
        userId: 'test-user-id-12345',
        agentId: testAgentId,
      },
    });
    testConversationId = conversation.id;
  });

  afterAll(async () => {
    // Limpar dados de teste
    await prisma.document.deleteMany({});
    await prisma.conversation.deleteMany({
      where: {
        agent: { slug: 'test-document-agent' },
      },
    });
    await server.close();
    await prisma.$disconnect();

    // Limpar arquivos de teste
    const uploadsDir = path.join(process.cwd(), 'uploads', 'documents');
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      for (const file of files) {
        if (file.includes('test-document')) {
          fs.unlinkSync(path.join(uploadsDir, file));
        }
      }
    }
  });

  describe('POST /api/conversations/:id/documents/generate', () => {
    it('should generate a DOCX document', async () => {
      const response = await server.inject({
        method: 'POST',
        url: `/api/conversations/${testConversationId}/documents/generate`,
        payload: {
          name: 'Test Document DOCX',
          content:
            '# Título\n\nEste é um parágrafo de teste.\n\n## Subtítulo\n\n- Item 1\n- Item 2',
          type: 'docx',
        },
      });

      expect(response.statusCode).toBe(201);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data).toHaveProperty('id');
      expect(body.data.name).toBe('Test Document DOCX');
      expect(body.data.type).toBe('docx');
      expect(body.data.url).toContain('/api/documents/download/');
    });

    it('should generate a PDF document', async () => {
      const response = await server.inject({
        method: 'POST',
        url: `/api/conversations/${testConversationId}/documents/generate`,
        payload: {
          name: 'Test Document PDF',
          content: '# Título\n\nEste é um parágrafo de teste.',
          type: 'pdf',
        },
      });

      expect(response.statusCode).toBe(201);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.type).toBe('pdf');
    });

    it('should return 400 for missing name', async () => {
      const response = await server.inject({
        method: 'POST',
        url: `/api/conversations/${testConversationId}/documents/generate`,
        payload: {
          content: 'Conteúdo',
          type: 'docx',
        },
      });

      expect(response.statusCode).toBe(400);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
    });

    it('should return 400 for invalid type', async () => {
      const response = await server.inject({
        method: 'POST',
        url: `/api/conversations/${testConversationId}/documents/generate`,
        payload: {
          name: 'Test',
          content: 'Conteúdo',
          type: 'txt',
        },
      });

      expect(response.statusCode).toBe(400);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
    });

    it('should return 404 for non-existent conversation', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/conversations/non-existent-id/documents/generate',
        payload: {
          name: 'Test',
          content: 'Conteúdo',
          type: 'docx',
        },
      });

      expect(response.statusCode).toBe(404);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
    });
  });

  describe('GET /api/conversations/:id/documents', () => {
    beforeEach(async () => {
      // Criar documentos de teste
      await prisma.document.create({
        data: {
          name: 'Documento de teste 1',
          type: 'docx',
          url: '/api/documents/download/test-1.docx',
          conversationId: testConversationId,
        },
      });
      await prisma.document.create({
        data: {
          name: 'Documento de teste 2',
          type: 'pdf',
          url: '/api/documents/download/test-2.pdf',
          conversationId: testConversationId,
        },
      });
    });

    it('should list documents for a conversation', async () => {
      const response = await server.inject({
        method: 'GET',
        url: `/api/conversations/${testConversationId}/documents`,
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.data.length).toBeGreaterThanOrEqual(2);
    });

    it('should return 404 for non-existent conversation', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/conversations/non-existent-id/documents',
      });

      expect(response.statusCode).toBe(404);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
    });
  });

  describe('DELETE /api/documents/:id', () => {
    let testDocumentId: string;

    beforeEach(async () => {
      const document = await prisma.document.create({
        data: {
          name: 'Documento para deletar',
          type: 'docx',
          url: '/api/documents/download/delete-test.docx',
          conversationId: testConversationId,
        },
      });
      testDocumentId = document.id;
    });

    it('should delete a document', async () => {
      const response = await server.inject({
        method: 'DELETE',
        url: `/api/documents/${testDocumentId}`,
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);

      // Verificar se foi deletado
      const deleted = await prisma.document.findUnique({
        where: { id: testDocumentId },
      });
      expect(deleted).toBeNull();
    });

    it('should return 404 for non-existent document', async () => {
      const response = await server.inject({
        method: 'DELETE',
        url: '/api/documents/non-existent-id',
      });

      expect(response.statusCode).toBe(404);

      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
    });
  });
});
