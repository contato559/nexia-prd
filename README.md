# Nexia PRD

Sistema de geração de documentos profissionais com IA. Crie PRDs, escopos comerciais e técnicos de forma rápida e estruturada usando inteligência artificial.

## Funcionalidades

- **3 Agentes Especializados**: PRD Generator, Escopo Comercial e Escopo Técnico
- **Chat com IA**: Interface de chat com streaming em tempo real
- **Geração de Documentos**: Exporte para DOCX ou PDF
- **Histórico de Conversas**: Mantenha um registro de todas as suas conversas

## Estrutura do Projeto

```
/nexia-prd
├── /apps
│   ├── /web          # Frontend Next.js 15
│   └── /api          # Backend Fastify
├── /packages
│   └── /shared       # Types compartilhados
├── docker-compose.yml
└── package.json
```

## Requisitos

- Node.js 18+
- npm 9+
- PostgreSQL 16+ (ou Docker)
- Chave de API da Anthropic (Claude)

## Instalação

```bash
# Clone o repositório
git clone <repo-url>
cd nexia-prd

# Instale as dependências
npm install
```

## Configuração

### Variáveis de Ambiente

Copie os arquivos de exemplo e configure:

```bash
# Backend
cp apps/api/.env.example apps/api/.env
```

**apps/api/.env:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nexia_prd?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
ANTHROPIC_API_KEY="your-anthropic-api-key-here"
PORT=3001
```

**apps/web/.env.local (opcional):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Banco de Dados

### Opção 1: Docker (recomendado)

```bash
# Iniciar PostgreSQL
npm run db:up

# Rodar migrations
npm run db:migrate

# Popular com dados iniciais (agentes)
npm run db:seed
```

### Opção 2: PostgreSQL local

Configure a variável `DATABASE_URL` no arquivo `apps/api/.env` com sua conexão PostgreSQL, depois:

```bash
npm run db:migrate
npm run db:seed
```

## Executando o Projeto

### Desenvolvimento

```bash
# Iniciar todos os apps (frontend + backend)
npm run dev

# Ou separadamente:
npm run dev:web    # Frontend em http://localhost:3000
npm run dev:api    # Backend em http://localhost:3001
```

### Comandos Úteis

```bash
# Lint
npm run lint
npm run lint:fix

# Formatação
npm run format

# Testes (backend)
cd apps/api && npm test

# Prisma Studio (visualizar banco)
npm run db:studio
```

## Stack Tecnológico

### Frontend (`/apps/web`)

- **Next.js 15** - App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4** - Estilização
- **shadcn/ui** - Componentes de UI
- **react-markdown** - Renderização de Markdown

### Backend (`/apps/api`)

- **Fastify** - Framework HTTP
- **TypeScript** - Tipagem estática
- **Prisma ORM** - Acesso ao banco de dados
- **PostgreSQL** - Banco de dados
- **Zod** - Validação de schemas
- **Anthropic SDK** - Integração com Claude
- **docx/pdfkit** - Geração de documentos

## Agentes Disponíveis

O sistema vem com 3 agentes pré-configurados:

| Agente | Slug | Descrição |
|--------|------|-----------|
| **PRD Generator** | `prd-generator` | Gera Product Requirements Documents completos |
| **Escopo Comercial** | `escopo-comercial` | Cria propostas comerciais para projetos |
| **Escopo Técnico** | `escopo-tecnico` | Desenvolve documentação técnica detalhada |

## API Endpoints

### Agentes
- `GET /api/agents` - Lista todos os agentes
- `GET /api/agents/:slug` - Retorna um agente pelo slug

### Conversas
- `POST /api/conversations` - Cria nova conversa
- `GET /api/conversations` - Lista conversas
- `GET /api/conversations/:id` - Detalhes da conversa
- `DELETE /api/conversations/:id` - Deleta conversa

### Mensagens
- `POST /api/conversations/:id/messages` - Envia mensagem (SSE streaming)

### Documentos
- `POST /api/conversations/:id/documents/generate` - Gera documento
- `GET /api/conversations/:id/documents` - Lista documentos
- `GET /api/documents/download/:filename` - Download do documento
- `DELETE /api/documents/:id` - Deleta documento

## Fluxo de Uso

1. Acesse `http://localhost:3000`
2. Selecione um agente na tela de boas-vindas
3. Descreva o documento que deseja criar
4. A IA irá gerar o conteúdo em tempo real (streaming)
5. Exporte o documento em DOCX ou PDF

## Licença

MIT
