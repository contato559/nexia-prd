import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { registerRoutes } from './routes/index.js';

const fastify = Fastify({
  logger: true,
});

// Configurar CORS para produção
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

fastify.register(cors, {
  origin: process.env.NODE_ENV === 'production' ? allowedOrigins : true,
  credentials: true,
});

fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'development-secret-change-in-production',
});

// Rota de health check
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Registrar rotas da API
fastify.register(registerRoutes, { prefix: '/api' });

// Iniciar servidor
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3001', 10);
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`API server running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
