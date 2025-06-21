# ✅ Checklist para Deploy na Vercel

## 🔧 **1. Configuração Local (JÁ FEITO)**
- ✅ Projeto Next.js criado
- ✅ Prisma configurado
- ✅ Supabase conectado
- ✅ Posts seedados
- ✅ Tailwind CSS funcionando

## 🌐 **2. Contas Necessárias**

### **Vercel** (https://vercel.com)
- [ ] Criar conta na Vercel
- [ ] Conectar com GitHub

### **Stripe** (https://stripe.com) 
- [ ] Criar conta no Stripe
- [ ] Pegar chaves de teste:
  - Publishable Key: `pk_test_...`
  - Secret Key: `sk_test_...`
- [ ] Configurar webhook (depois do deploy)

## 📝 **3. Variáveis de Ambiente**

Crie um arquivo `.env` na raiz do projeto com:

```env
# Database (já temos do Supabase)
DATABASE_URL="postgresql://postgres:[SUA_SENHA]@db.[PROJETO].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_SECRET="sua-chave-secreta-muito-longa-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

## 🚀 **4. Deploy na Vercel**

### **Passo 1: Conectar Repositório**
1. Acesse https://vercel.com
2. Clique em "New Project"
3. Selecione o repositório: `alexberneira/maternidadeconectada`
4. Clique em "Import"

### **Passo 2: Configurar Variáveis**
Na tela de configuração, adicione as variáveis de ambiente:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (https://seu-projeto.vercel.app)
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`

### **Passo 3: Deploy**
1. Clique em "Deploy"
2. Aguarde 2-3 minutos
3. Site estará em: `https://seu-projeto.vercel.app`

## 🔄 **5. Pós-Deploy**

### **Executar Migrações**
```bash
npx prisma migrate deploy
```

### **Configurar Webhook do Stripe**
1. No Stripe: Developers > Webhooks
2. URL: `https://seu-projeto.vercel.app/api/stripe/webhook`
3. Eventos: `checkout.session.completed`
4. Copiar `whsec_...` para `STRIPE_WEBHOOK_SECRET`

## 🎯 **Status Atual**
- ✅ Projeto funcionando localmente
- ✅ Banco configurado (Supabase)
- ✅ Posts criados
- ⏳ Aguardando: Conta Stripe + Deploy Vercel

## 📞 **Próximos Passos**
1. Criar conta no Stripe
2. Fazer deploy na Vercel
3. Configurar webhook
4. Testar pagamentos 