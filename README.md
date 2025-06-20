# Plataforma Maternidade - Next.js

Uma plataforma moderna para conteúdo exclusivo de maternidade com sistema de assinatura, posts em formato Instagram/Reels e painel administrativo.

## 🚀 Tecnologias

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Prisma** - ORM para banco de dados
- **NextAuth.js** - Autenticação
- **Stripe** - Pagamentos e assinaturas
- **Vercel Blob** - Upload de imagens
- **PostgreSQL** - Banco de dados
- **Docker Compose** - Orquestração do banco

## 📋 Funcionalidades

- ✅ Sistema de autenticação (login/registro)
- ✅ Posts em formato Instagram/Reels (título, subtítulo, texto, imagem)
- ✅ Painel administrativo para criar/gerenciar posts
- ✅ Sistema de assinatura (7 dias grátis, depois R$39/mês)
- ✅ Upload de imagens para posts
- ✅ Conteúdo protegido para assinantes
- ✅ Webhook Stripe para atualização automática de assinaturas

## 🛠️ Setup Rápido

### Pré-requisitos

- Node.js 18+
- Docker Desktop
- Conta no Stripe (para pagamentos)
- Conta na Vercel (para upload de imagens)

### 1. Clone e entre na pasta

```bash
cd maternidadejs
```

### 2. Suba o banco de dados com Docker Compose

```bash
docker-compose up -d
```

O banco ficará disponível em `localhost:5432` com:
- Banco: `maternidadejs`
- Usuário: `postgres`
- Senha: `senha`

### 3. Configure as chaves de API

Edite o arquivo `.env` e configure suas chaves:

```env
# Database
DATABASE_URL="postgresql://postgres:senha@localhost:5432/maternidadejs"

# NextAuth
NEXTAUTH_SECRET="sua_secret_aqui"
NEXTAUTH_URL="http://localhost:3000"

# Stripe (obtenha em https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_ID="price_xxx" # ID do produto criado no Stripe

# Vercel Blob (obtenha em https://vercel.com/dashboard)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
```

### 4. Instale as dependências e rode as migrations

```bash
npm install
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Inicie o projeto

```bash
npm run dev
```

### 6. Acesse

Abra [http://localhost:3000](http://localhost:3000)

## 📖 Como usar

### 1. Criar conta
- Acesse `/register` e crie uma conta
- Você receberá 7 dias de teste grátis

### 2. Fazer login
- Acesse `/login` com suas credenciais

### 3. Criar posts (Admin)
- Clique em "Admin" no header
- Preencha título, subtítulo, texto e imagem
- Clique em "Salvar Post"
- Use "Publicar" para tornar o post visível

### 4. Assinar (para ler posts completos)
- Clique em "Assinar Agora" no banner
- Complete o checkout no Stripe
- Após 7 dias, será cobrado R$39/mês

## 🔧 Configuração do Stripe

1. Crie uma conta em [stripe.com](https://stripe.com)
2. Vá em "Produtos" e crie um produto de assinatura
3. Configure o preço: R$39/mês
4. Copie o `price_id` para o `.env`
5. Configure o webhook em "Desenvolvedores > Webhooks":
   - URL: `https://seu-dominio.vercel.app/api/stripe/webhook`
   - Eventos: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

## 🚀 Deploy na Vercel

1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente no painel da Vercel
3. Deploy automático a cada push

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── api/               # Rotas de API
│   │   ├── auth/          # Autenticação
│   │   ├── admin/         # Painel admin
│   │   ├── stripe/        # Stripe checkout/webhook
│   │   └── upload/        # Upload de imagens
│   ├── login/             # Página de login
│   ├── register/          # Página de registro
│   ├── subscription/      # Página de assinatura
│   ├── admin/             # Painel administrativo
│   └── page.tsx           # Página principal
├── components/            # Componentes React
├── lib/                   # Configurações (Prisma, Stripe, Auth)
└── providers/             # Providers (NextAuth)
```

## 🐛 Troubleshooting

### Erro de conexão com banco
```bash
# Verificar se o container está rodando
docker-compose ps

# Reiniciar o container
docker-compose restart
```

### Erro de migrations
```bash
# Resetar banco
npx prisma migrate reset

# Rodar migrations novamente
npx prisma migrate dev
```

### Erro de upload de imagem
- Verifique se o `BLOB_READ_WRITE_TOKEN` está configurado
- Certifique-se de que a Vercel Blob está ativa no seu projeto

## 📝 Licença

MIT License
