import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { aiService } from '../services/ai.service.js';

// userId fixo para testes (sem autenticação)
const TEST_USER_ID = 'test-user-id-12345';

// Schemas de validação
const createConversationSchema = z.object({
  agentId: z.string().min(1, 'ID do agente é obrigatório'),
});

const sendMessageSchema = z.object({
  content: z.string().min(1, 'Conteúdo é obrigatório'),
});

export async function conversationsRoutes(fastify: FastifyInstance) {
  // POST /conversations - Cria uma nova conversa
  fastify.post(
    '/conversations',
    async (request: FastifyRequest<{ Body: { agentId: string } }>, reply: FastifyReply) => {
      try {
        const validation = createConversationSchema.safeParse(request.body);

        if (!validation.success) {
          return reply.status(400).send({
            success: false,
            error: validation.error.errors[0].message,
          });
        }

        const { agentId } = validation.data;

        // Verificar se o agente existe
        const agent = await prisma.agent.findUnique({
          where: { id: agentId },
        });

        if (!agent) {
          return reply.status(404).send({
            success: false,
            error: 'Agente não encontrado',
          });
        }

        // Garantir que o usuário de teste existe
        await prisma.user.upsert({
          where: { id: TEST_USER_ID },
          update: {},
          create: {
            id: TEST_USER_ID,
            name: 'Test User',
            email: 'test@example.com',
            password: 'test-password-hash',
          },
        });

        // Criar a conversa
        const conversation = await prisma.conversation.create({
          data: {
            title: 'Nova conversa',
            userId: TEST_USER_ID,
            agentId,
          },
          include: {
            agent: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        });

        return reply.status(201).send({
          success: true,
          data: conversation,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Erro ao criar conversa',
        });
      }
    }
  );

  // GET /conversations - Lista todas as conversas
  fastify.get('/conversations', async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const conversations = await prisma.conversation.findMany({
        where: { userId: TEST_USER_ID },
        orderBy: { updatedAt: 'desc' },
        include: {
          agent: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          _count: {
            select: { messages: true },
          },
        },
      });

      return reply.send({
        success: true,
        data: conversations,
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Erro ao listar conversas',
      });
    }
  });

  // GET /conversations/:id - Retorna uma conversa com mensagens e documentos
  fastify.get(
    '/conversations/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;

        const conversation = await prisma.conversation.findUnique({
          where: { id },
          include: {
            agent: true,
            messages: {
              orderBy: { createdAt: 'asc' },
            },
            documents: {
              orderBy: { createdAt: 'desc' },
            },
          },
        });

        if (!conversation) {
          return reply.status(404).send({
            success: false,
            error: 'Conversa não encontrada',
          });
        }

        return reply.send({
          success: true,
          data: conversation,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Erro ao buscar conversa',
        });
      }
    }
  );

  // DELETE /conversations/:id - Deleta uma conversa
  fastify.delete(
    '/conversations/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const { id } = request.params;

        const conversation = await prisma.conversation.findUnique({
          where: { id },
        });

        if (!conversation) {
          return reply.status(404).send({
            success: false,
            error: 'Conversa não encontrada',
          });
        }

        await prisma.conversation.delete({
          where: { id },
        });

        return reply.send({
          success: true,
          message: 'Conversa deletada com sucesso',
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Erro ao deletar conversa',
        });
      }
    }
  );

  // POST /conversations/:id/messages - Envia uma mensagem e recebe resposta da IA via SSE
  fastify.post(
    '/conversations/:id/messages',
    async (
      request: FastifyRequest<{
        Params: { id: string };
        Body: { content: string };
      }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;

      try {
        const validation = sendMessageSchema.safeParse(request.body);

        if (!validation.success) {
          return reply.status(400).send({
            success: false,
            error: validation.error.errors[0].message,
          });
        }

        const { content } = validation.data;

        // Buscar conversa com agente e mensagens
        const conversation = await prisma.conversation.findUnique({
          where: { id },
          include: {
            agent: true,
            messages: {
              orderBy: { createdAt: 'asc' },
            },
          },
        });

        if (!conversation) {
          return reply.status(404).send({
            success: false,
            error: 'Conversa não encontrada',
          });
        }

        // Salvar mensagem do usuário
        const userMessage = await prisma.message.create({
          data: {
            role: 'user',
            content,
            conversationId: id,
          },
        });

        // Verificar se é a primeira mensagem para atualizar o título
        const isFirstMessage = conversation.messages.length === 0;

        if (isFirstMessage) {
          const newTitle = aiService.generateTitleFromContent(content);
          await prisma.conversation.update({
            where: { id },
            data: { title: newTitle },
          });
        }

        // Preparar mensagens para a IA (incluindo a nova mensagem do usuário)
        const allMessages = [...conversation.messages, userMessage];
        const aiMessages = aiService.formatMessagesForAI(allMessages);

        // Configurar SSE
        reply.raw.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
          'Access-Control-Allow-Origin': '*',
        });

        // Enviar ID da mensagem do usuário
        reply.raw.write(
          `data: ${JSON.stringify({ type: 'user_message', id: userMessage.id })}\n\n`
        );

        // Stream da resposta da IA
        await aiService.streamResponse(conversation.agent.systemPrompt, aiMessages, {
          onToken: (token) => {
            reply.raw.write(`data: ${JSON.stringify({ type: 'token', content: token })}\n\n`);
          },
          onComplete: async (fullResponse) => {
            // Salvar resposta do assistente
            const assistantMessage = await prisma.message.create({
              data: {
                role: 'assistant',
                content: fullResponse,
                conversationId: id,
              },
            });

            // Atualizar updatedAt da conversa
            await prisma.conversation.update({
              where: { id },
              data: { updatedAt: new Date() },
            });

            reply.raw.write(
              `data: ${JSON.stringify({
                type: 'complete',
                assistantMessageId: assistantMessage.id,
              })}\n\n`
            );
            reply.raw.end();
          },
          onError: (error) => {
            fastify.log.error(error);
            reply.raw.write(
              `data: ${JSON.stringify({
                type: 'error',
                message: error.message,
              })}\n\n`
            );
            reply.raw.end();
          },
        });
      } catch (error) {
        fastify.log.error(error);

        // Se ainda não começou o streaming, enviar erro JSON normal
        if (!reply.raw.headersSent) {
          return reply.status(500).send({
            success: false,
            error: 'Erro ao processar mensagem',
          });
        }

        // Se já começou o streaming, enviar erro via SSE
        reply.raw.write(
          `data: ${JSON.stringify({
            type: 'error',
            message: 'Erro interno ao processar mensagem',
          })}\n\n`
        );
        reply.raw.end();
      }
    }
  );
}
