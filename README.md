# 🌸 Plataforma de Maternidade

Uma plataforma moderna e completa para conteúdo sobre maternidade, desenvolvida com Next.js, TypeScript, Prisma e Stripe.

## ✨ Características

- **🎨 Design Moderno**: Interface elegante e responsiva
- **🔐 Autenticação**: Sistema de login/registro com NextAuth
- **💳 Pagamentos**: Integração com Stripe para assinaturas
- **📝 Sistema de Posts**: Criação e gerenciamento de conteúdo
- **👑 Painel Admin**: Área administrativa para gerenciar posts
- **📱 Responsivo**: Funciona perfeitamente em todos os dispositivos
- **🚀 Deploy Automático**: Pronto para deploy no Vercel

## 🛠️ Tecnologias

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Banco de Dados**: PostgreSQL
- **Autenticação**: NextAuth.js
- **Pagamentos**: Stripe
- **Upload**: Vercel Blob Storage
- **Deploy**: Vercel

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+ 
- Docker (para banco de dados local)
- Conta no Stripe
- Conta no Vercel (opcional)

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd maternidadejs
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/maternidade"

# NextAuth
NEXTAUTH_SECRET="seu-secret-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Vercel Blob (opcional)
BLOB_READ_WRITE_TOKEN="vercel_blob_token"
```

### 4. Inicie o banco de dados

```bash
docker-compose up -d
```

### 5. Execute as migrações

```bash
npx prisma migrate dev
```

### 6. Gere o Prisma Client

```bash
npx prisma generate
```

### 7. Popule o banco com dados de exemplo

```bash
npx tsx scripts/seed-posts.ts
```

### 8. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
maternidadejs/
├── prisma/                 # Schema do banco de dados
├── scripts/               # Scripts de seed e setup
├── src/
│   ├── app/              # App Router do Next.js
│   │   ├── admin/        # Painel administrativo
│   │   ├── api/          # API Routes
│   │   ├── login/        # Página de login
│   │   ├── register/     # Página de registro
│   │   └── subscription/ # Página de assinatura
│   ├── components/       # Componentes React
│   ├── lib/             # Utilitários e configurações
│   └── providers/       # Providers do React
├── docker-compose.yml    # Configuração do Docker
└── README.md
```

## 🔧 Configuração do Stripe

1. Crie uma conta no [Stripe](https://stripe.com)
2. Obtenha suas chaves de API no dashboard
3. Configure o webhook para `/api/stripe/webhook`
4. Adicione as chaves no arquivo `.env`

## 🚀 Deploy no Vercel

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Variáveis de ambiente no Vercel:

```env
DATABASE_URL="sua_url_do_postgresql"
NEXTAUTH_SECRET="seu_secret"
NEXTAUTH_URL="https://seu-dominio.vercel.app"
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
BLOB_READ_WRITE_TOKEN="vercel_blob_token"
```

## 👥 Usuários Padrão

- **Admin**: admin@maternidade.com / admin123
- **Usuário**: Crie uma conta através do registro

## 📝 Funcionalidades

### Para Visitantes
- Visualizar posts públicos
- Ver preview do conteúdo exclusivo
- Registrar conta gratuita
- Fazer login

### Para Assinantes
- Acesso completo a todo conteúdo
- 7 dias grátis de teste
- Cancelamento a qualquer momento

### Para Administradores
- Criar e editar posts
- Publicar/despublicar conteúdo
- Upload de imagens
- Gerenciar usuários

## 🎨 Design System

- **Cores**: Rosa (#ec4899) e Roxo (#8b5cf6)
- **Fonte**: Inter
- **Layout**: Responsivo com Tailwind CSS
- **Componentes**: Reutilizáveis e modulares

## 🔒 Segurança

- Autenticação com NextAuth.js
- Senhas hasheadas
- Proteção de rotas
- Validação de dados
- HTTPS em produção

## 📈 Próximos Passos

- [ ] Sistema de comentários
- [ ] Notificações por email
- [ ] App mobile
- [ ] Analytics avançado
- [ ] Sistema de tags/categorias
- [ ] Busca avançada

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas, abra uma issue no GitHub.

---

**Desenvolvido com ❤️ para mães e famílias**
