# API Electron Backend

API backend para o e-commerce Electron construída com Fastify, Prisma e PostgreSQL.

## Requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- PostgreSQL

### Estrutura do Projeto

```
electron-api/
├── prisma/
│   ├── migrations/    # Migrações do banco de dados
│   └── schema.prisma  # Esquema do banco de dados
├── src/
│   ├── modules/       # Módulos da aplicação
│   │   ├── user/      # Módulo de usuários
│   │   ├── product/   # Módulo de produtos
│   │   ├── cart/      # Módulo de carrinho
│   │   ├── order/     # Módulo de pedidos
│   │   ├── payment/   # Módulo de pagamentos
│   │   ├── shipping/  # Módulo de frete
│   │   └── address/   # Módulo de endereços
│   ├── types/         # Tipos globais
│   ├── utils/         # Utilitários
│   └── server.ts      # Ponto de entrada da aplicação
└── package.json       # Dependências e scripts
```

Cada módulo contém:
- `*.route.ts`: Definição de rotas
- `*.controller.ts`: Controladores
- `*.service.ts`: Camada de serviço (lógica de negócios)
- `*.schema.ts`: Validação e schemas

## Instalação e Configuração

1. Instale as dependências do projeto:

```powershell
npm install
# ou
yarn install
```

2. Configure o ambiente:

   - Copie o arquivo `.env.example` para `.env` ou renomeie-o:
   - Edite o arquivo `.env` com suas configurações:
   
   ```
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/electron?schema=public"
   
   # JWT
   JWT_SECRET="sua-chave-secreta-aqui"
   JWT_EXPIRES_IN="1d"
   
   # App
   PORT=3001
   HOST="localhost"
   
   # Stripe (se aplicável)
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

3. Configure o banco de dados:

```powershell
# Gerar o Prisma Client
npm run prisma:generate
# ou
yarn prisma:generate

# Executar migrações do banco de dados
npm run prisma:migrate
# ou
yarn prisma:migrate
```

4. Iniciar o servidor:

```powershell
# Modo desenvolvimento
npm run dev
# ou
yarn dev

# Modo produção (build + start)
npm run build
npm run start
# ou
yarn build
yarn start
```

5. Acesse o Prisma Studio para gerenciar o banco de dados:

```powershell
npm run prisma:studio
# ou
yarn prisma:studio
```

O Prisma Studio estará disponível em `http://localhost:5555`

## Documentação da API

A documentação Swagger da API está disponível em `http://localhost:3001/docs` quando o servidor estiver em execução.

## Autenticação

A API utiliza autenticação JWT (JSON Web Token). Para fazer requisições em endpoints protegidos, adicione o token no cabeçalho de autorização:

```
Authorization: Bearer seu_token_aqui
```

O token é obtido durante o login e tem validade conforme configurado em `JWT_EXPIRES_IN` no arquivo `.env`.

## Modelos de Dados

### Usuário (User)
- `id`: String (UUID)
- `email`: String
- `password`: String (hash)
- `name`: String
- `role`: Enum (ADMIN, CUSTOMER)
- `addresses`: Relacionamento com endereços
- `orders`: Relacionamento com pedidos
- `cart`: Relacionamento com carrinho

### Endereço (Address)
- `id`: String (UUID)
- `street`: String
- `number`: String
- `complement`: String (opcional)
- `neighborhood`: String
- `city`: String
- `state`: String
- `zipCode`: String
- `isDefault`: Boolean
- `userId`: String (referência ao usuário)

### Produto (Product)
- `id`: String (UUID)
- `title`: String
- `description`: String
- `price`: Decimal
- `discountedPrice`: Decimal (opcional)
- `stock`: Integer
- `images`: Relacionamento com imagens
- `category`: String
- `rating`: Float
- `featured`: Boolean

### Carrinho (Cart)
- `id`: String (UUID)
- `userId`: String (referência ao usuário)
- `items`: Relacionamento com itens do carrinho
- `total`: Decimal

### Pedido (Order)
- `id`: String (UUID)
- `userId`: String (referência ao usuário)
- `addressId`: String (referência ao endereço)
- `items`: Relacionamento com itens do pedido
- `status`: Enum (PENDING, CONFIRMED, SHIPPING, DELIVERED, CANCELED)
- `total`: Decimal
- `shippingCost`: Decimal
- `paymentMethod`: Enum (CREDIT_CARD, BOLETO, PIX)

## Desenvolvimento

### Scripts Disponíveis

- `npm run dev`: Inicia o servidor em modo de desenvolvimento
- `npm run build`: Compila o código TypeScript
- `npm run start`: Inicia o servidor com o código compilado
- `npm run prisma:generate`: Gera o Prisma Client
- `npm run prisma:migrate`: Executa migrações do banco de dados
- `npm run prisma:studio`: Inicia o Prisma Studio

## Integração Frontend

Ao integrar com o frontend, certifique-se de:

1. Configurar o header `Authorization` com o token JWT em requisições autenticadas
2. Tratar adequadamente os códigos de status HTTP
3. Seguir o formato de corpo de requisição conforme documentado no Swagger