# Projeto Electron

Este repositório contém a aplicação Electron, um projeto de e-commerce com frontend em Nuxt.js/Vue 3 e backend em Node.js com Fastify e Prisma.

## Requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- PostgreSQL

## Instalação e Configuração

### Frontend (Aplicação Nuxt.js)

1. Instale as dependências do frontend:

```powershell
npm install
# ou
yarn install
```

2. Para iniciar o servidor de desenvolvimento:

```powershell
npm run dev
# ou
yarn dev
```

3. Para compilar e minificar para produção:

```powershell
npm run build
# ou
yarn build
```

4. Para pré-visualizar a aplicação de produção:

```powershell
npm run preview
# ou
yarn preview
```

O frontend estará disponível em `http://localhost:3000` por padrão.

### Backend (API na pasta electron-api)

1. Navegue até a pasta da API:

```powershell
cd electron-api
```

2. Instale as dependências do backend:

```powershell
npm install
# ou
yarn install
```

3. Configure o arquivo de ambiente:

Copie o arquivo .env.exemplo para .env ou simplesmente renomeie
- Edite o arquivo .env com suas configurações

Você precisará configurar:
- `DATABASE_URL`: URL de conexão com o banco de dados PostgreSQL
- `JWT_SECRET`: Chave secreta para autenticação JWT
- `PORT`: Porta onde a API será executada (padrão: 3001)
- `STRIPE_SECRET_KEY`: Chave secreta do Stripe (se aplicável)
- `STRIPE_WEBHOOK_SECRET`: Chave secreta do webhook do Stripe (se aplicável)

4. Configure o banco de dados usando Prisma:

```powershell
# Gere os arquivos do Prisma Client
npm run prisma:generate
# ou
yarn prisma:generate

# Execute as migrações do banco de dados
npm run prisma:migrate
# ou
yarn prisma:migrate
```

5. Inicie o servidor de desenvolvimento:

```powershell
npm run dev
# ou
yarn dev
```

A API estará disponível em `http://localhost:3001` por padrão.

Para visualizar o banco de dados com Prisma Studio:

```powershell
npm run prisma:studio
# ou
yarn prisma:studio
```

## Estrutura do Projeto

- `pages/`: Páginas da aplicação frontend
- `components/`: Componentes reutilizáveis do frontend
- `electron-api/`: Backend da aplicação
  - `prisma/`: Esquema e migrações do banco de dados
  - `src/`: Código-fonte do backend
