# 🚀 Deploy Simplificado - SQLite + Stripe

## ✅ **Vantagens desta configuração:**
- ✅ **Zero configuração de banco** - SQLite é um arquivo local
- ✅ **Stripe funcionando** - Pagamentos normais
- ✅ **Deploy super fácil** - Só configurar Stripe
- ✅ **Gratuito** - Sem custos de banco de dados

## 🎯 **Setup Local (2 minutos)**

### **1. Instalar dependências**
```bash
npm install
```

### **2. Setup automático**
```bash
# Windows
.\setup-sqlite.ps1

# Linux/Mac
chmod +x setup-sqlite.sh
./setup-sqlite.sh
```

### **3. Configurar .env**
Crie um arquivo `.env` na raiz:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
NEXTAUTH_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### **4. Rodar projeto**
```bash
npm run dev
```

## 🌐 **Deploy na Vercel (5 minutos)**

### **Passo 1: Criar conta**
1. Acesse https://vercel.com
2. Conecte com GitHub

### **Passo 2: Importar projeto**
1. Clique em "New Project"
2. Selecione: `alexberneira/maternidadeconectada`
3. Clique em "Import"

### **Passo 3: Configurar variáveis**
Na tela de configuração, adicione:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
NEXTAUTH_URL="https://seu-projeto.vercel.app"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### **Passo 4: Deploy**
- Clique em "Deploy"
- Aguarde 2 minutos
- Pronto! 🎉

## 🔧 **Configurar Stripe**

### **1. Criar conta Stripe**
1. Acesse https://stripe.com
2. Crie uma conta
3. Vá em "Developers > API Keys"
4. Copie as chaves de teste

### **2. Configurar webhook**
1. No Stripe: "Developers > Webhooks"
2. URL: `https://seu-projeto.vercel.app/api/stripe/webhook`
3. Eventos: `checkout.session.completed`
4. Copiar `whsec_...` para `STRIPE_WEBHOOK_SECRET`

## 📊 **O que funciona:**
- ✅ Posts com imagens
- ✅ Sistema de login
- ✅ Pagamentos com Stripe
- ✅ Assinaturas mensais
- ✅ Conteúdo exclusivo para assinantes

## 🎯 **Limitações do SQLite:**
- ⚠️ Não ideal para milhares de usuários simultâneos
- ⚠️ Não funciona com múltiplos servidores
- ✅ **Perfeito para MVP e projetos pequenos/médios**

## 💡 **Quando migrar para PostgreSQL:**
- Quando tiver mais de 1000 usuários ativos
- Quando precisar de múltiplos servidores
- Quando quiser melhor performance

---

**🎉 Resultado: Deploy em 5 minutos, Stripe funcionando, zero configuração de banco!** 