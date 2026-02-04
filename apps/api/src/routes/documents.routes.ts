import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import * as path from 'path';
import * as fs from 'fs';
import { generateDocumentSchema } from '../schemas/document.schema.js';
import { documentService } from '../services/document.service.js';
import { prisma } from '../lib/prisma.js';

export async function documentsRoutes(fastify: FastifyInstance) {
  // POST /conversations/:id/documents/generate - Gera um documento
  fastify.post(
    '/conversations/:id/documents/generate',
    async (
      request: FastifyRequest<{
        Params: { id: string };
        Body: { name: string; content: string; type: 'docx' | 'pdf' };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const { id: conversationId } = request.params;

        const validation = generateDocumentSchema.safeParse(request.body);

        if (!validation.success) {
          return reply.status(400).send({
            success: false,
            error: validation.error.errors[0].message,
          });
        }

        const { name, content, type } = validation.data;

        // Verificar se a conversa existe
        const conversation = await prisma.conversation.findUnique({
          where: { id: conversationId },
        });

        if (!conversation) {
          return reply.status(404).send({
            success: false,
            error: 'Conversa não encontrada',
          });
        }

        const document = await documentService.generateAndSave(conversationId, name, content, type);

        return reply.status(201).send({
          success: true,
          data: document,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: error instanceof Error ? error.message : 'Erro ao gerar documento',
        });
      }
    }
  );

  // GET /conversations/:id/documents - Lista documentos de uma conversa
  fastify.get(
    '/conversations/:id/documents',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const { id: conversationId } = request.params;

        // Verificar se a conversa existe
        const conversation = await prisma.conversation.findUnique({
          where: { id: conversationId },
        });

        if (!conversation) {
          return reply.status(404).send({
            success: false,
            error: 'Conversa não encontrada',
          });
        }

        const documents = await documentService.listByConversation(conversationId);

        return reply.send({
          success: true,
          data: documents,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Erro ao listar documentos',
        });
      }
    }
  );

  // GET /documents/download/:filename - Download de um documento
  fastify.get(
    '/documents/download/:filename',
    async (request: FastifyRequest<{ Params: { filename: string } }>, reply: FastifyReply) => {
      try {
        const { filename } = request.params;

        // Validar filename para evitar path traversal
        const sanitizedFilename = path.basename(filename);
        const filePath = documentService.getFilePath(sanitizedFilename);

        if (!filePath) {
          return reply.status(404).send({
            success: false,
            error: 'Arquivo não encontrado',
          });
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType =
          ext === '.pdf'
            ? 'application/pdf'
            : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

        const fileStream = fs.createReadStream(filePath);

        return reply
          .header('Content-Type', contentType)
          .header('Content-Disposition', `attachment; filename="${sanitizedFilename}"`)
          .send(fileStream);
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Erro ao baixar documento',
        });
      }
    }
  );

  // DELETE /documents/:id - Deleta um documento
  fastify.delete(
    '/documents/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;

        const document = await documentService.findById(id);

        if (!document) {
          return reply.status(404).send({
            success: false,
            error: 'Documento não encontrado',
          });
        }

        await documentService.delete(id);

        return reply.send({
          success: true,
          message: 'Documento deletado com sucesso',
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Erro ao deletar documento',
        });
      }
    }
  );
}
