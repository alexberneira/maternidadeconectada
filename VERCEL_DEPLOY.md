# 🚀 Deploy na Vercel - Guia Completo

## 📋 Pré-requisitos

- ✅ Repositório no GitHub (já temos!)
- ✅ Conta na Vercel
- ✅ Conta no Stripe (para pagamentos)
- ✅ Banco PostgreSQL na nuvem

## 🔗 Links Úteis

- **Vercel**: https://vercel.com
- **Stripe**: https://stripe.com
- **Supabase** (PostgreSQL): https://supabase.com
- **Neon** (PostgreSQL): https://neon.tech

## 🎯 Passo a Passo

### 1. **Criar Conta na Vercel**

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Sign Up"**
3. Conecte com sua conta GitHub
4. Autorize o acesso ao repositório

### 2. **Importar o Projeto**

1. No dashboard da Vercel, clique em **"New Project"**
2. Selecione o repositório: `alexberneira/maternidadeconectada`
3. Clique em **"Import"**

### 3. **Configurar o Projeto**

Na tela de configuração:

- **Framework Preset**: Next.js (deve ser detectado automaticamente)
- **Root Directory**: `./` (deixe vazio)
- **Build Command**: `npm run build` (padrão)
- **Output Directory**: `.next` (padrão)
- **Install Command**: `npm install` (padrão)

### 4. **Configurar Banco de Dados**

#### Opção A: Supabase (Recomendado)

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta e um novo projeto
3. Vá em **Settings > Database**
4. Copie a **Connection String**
5. Formato: `postgresql://postgres:[password]@[host]:5432/postgres`

#### Opção B: Neon

1. Acesse [neon.tech](https://neon.tech)
2. Crie uma conta e um novo projeto
3. Copie a **Connection String**

### 5. **Configurar Stripe**

1. Acesse [stripe.com](https://stripe.com)
2. Crie uma conta
3. Vá em **Developers > API Keys**
4. Copie as chaves:
   - **Publishable Key** (pk_live_...)
   - **Secret Key** (sk_live_...)

### 6. **Configurar Webhook do Stripe**

1. No Stripe, vá em **Developers > Webhooks**
2. Clique em **"Add endpoint"**
3. URL: `https://seu-projeto.vercel.app/api/stripe/webhook`
4. Eventos: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
5. Copie o **Webhook Secret** (whsec_...)

### 7. **Adicionar Variáveis de Ambiente**

Na Vercel, vá em **Settings > Environment Variables** e adicione:

```env
# Database
DATABASE_URL="postgresql://usuario:senha@host:porta/banco"

# NextAuth
NEXTAUTH_SECRET="sua-chave-secreta-muito-longa-aqui"
NEXTAUTH_URL="https://seu-projeto.vercel.app"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Vercel Blob (opcional)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
```

### 8. **Gerar NEXTAUTH_SECRET**

Execute no terminal:
```bash
openssl rand -base64 32
```

### 9. **Deploy**

1. Clique em **"Deploy"**
2. Aguarde o build (2-3 minutos)
3. Seu site estará em: `https://seu-projeto.vercel.app`

## 🔧 Pós-Deploy

### 1. **Executar Migrações**

Após o deploy, execute as migrações do Prisma:

```bash
# No terminal da Vercel ou via API
npx prisma migrate deploy
```

### 2. **Popular o Banco**

Execute o script de seed:

```bash
npx tsx scripts/seed-posts.ts
```

### 3. **Configurar Domínio Personalizado (Opcional)**

1. Na Vercel, vá em **Settings > Domains**
2. Adicione seu domínio
3. Configure os DNS conforme instruções

## 🐛 Troubleshooting

### Erro de Build

Se houver erro no build:

1. Verifique se todas as variáveis de ambiente estão configuradas
2. Verifique se o `DATABASE_URL` está correto
3. Verifique se o repositório está sincronizado

### Erro de Conexão com Banco

1. Verifique se o banco está ativo
2. Verifique se o `DATABASE_URL` está correto
3. Verifique se o IP da Vercel está liberado no banco

### Erro de Stripe

1. Verifique se as chaves do Stripe estão corretas
2. Verifique se o webhook está configurado
3. Use chaves de teste primeiro (`sk_test_`)

## 📊 Monitoramento

### Vercel Analytics

1. Vá em **Analytics** no dashboard da Vercel
2. Ative o analytics para monitorar performance

### Logs

1. Vá em **Functions** no dashboard da Vercel
2. Clique em uma função para ver os logs

## 🔄 Deploy Automático

O deploy automático já está configurado! A cada push para a branch `main`, o site será atualizado automaticamente.

## 🎉 Próximos Passos

1. **Teste o site** em produção
2. **Configure analytics** (Google Analytics, etc.)
3. **Configure backup** do banco de dados
4. **Configure monitoramento** de erros
5. **Otimize performance** conforme necessário

---

**🎯 Dica**: Mantenha as chaves de teste do Stripe durante o desenvolvimento e mude para produção apenas quando estiver tudo funcionando! 