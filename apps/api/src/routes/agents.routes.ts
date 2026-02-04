import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma.js';

export async function agentsRoutes(fastify: FastifyInstance) {
  // GET /agents - Lista todos os agentes
  fastify.get('/agents', async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const agents = await prisma.agent.findMany({
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          createdAt: true,
        },
      });

      return reply.send({
        success: true,
        data: agents,
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Erro ao listar agentes',
      });
    }
  });

  // GET /agents/:slug - Retorna um agente pelo slug
  fastify.get(
    '/agents/:slug',
    async (request: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) => {
      try {
        const { slug } = request.params;

        const agent = await prisma.agent.findUnique({
          where: { slug },
        });

        if (!agent) {
          return reply.status(404).send({
            success: false,
            error: 'Agente não encontrado',
          });
        }

        return reply.send({
          success: true,
          data: agent,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Erro ao buscar agente',
        });
      }
    }
  );
}
