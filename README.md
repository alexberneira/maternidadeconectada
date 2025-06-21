# 🤱 Maternidade Conectada

Plataforma de conteúdo para mães com sistema de assinatura e pagamentos via Stripe.

## ✨ **Características**

- 📱 Interface moderna e responsiva
- 🔐 Sistema de autenticação
- 💳 Pagamentos via Stripe
- 📝 Posts com imagens e conteúdo exclusivo
- 🎯 Assinatura mensal com trial gratuito
- 🚀 Deploy simplificado (SQLite + Vercel)

## 🚀 **Deploy Super Rápido**

### **Setup Local (2 minutos)**
```bash
# 1. Instalar dependências
npm install

# 2. Setup automático
.\setup-sqlite.ps1  # Windows
# ou
./setup-sqlite.sh   # Linux/Mac

# 3. Configurar .env
cp env.example .env
# Editar .env com suas chaves do Stripe

# 4. Rodar projeto
npm run dev
```

### **Deploy na Vercel (5 minutos)**
1. Conecte GitHub na Vercel
2. Importe o repositório
3. Configure variáveis de ambiente
4. Deploy automático! 🎉

## 🛠️ **Tecnologias**

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Banco**: SQLite (Prisma ORM)
- **Autenticação**: NextAuth.js
- **Pagamentos**: Stripe
- **Deploy**: Vercel

## 📁 **Estrutura do Projeto**

```
src/
├── app/                 # App Router (Next.js 15)
│   ├── api/            # API Routes
│   ├── auth/           # Páginas de autenticação
│   └── globals.css     # Estilos globais
├── components/         # Componentes React
├── lib/               # Utilitários e configurações
└── data/              # Dados estáticos
prisma/
├── schema.prisma      # Schema do banco
└── migrations/        # Migrações
```

## 🔧 **Configuração**

### **Variáveis de Ambiente**

Crie um arquivo `.env` na raiz:

```env
# Database (SQLite - arquivo local)
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### **Configurar Stripe**

1. Crie uma conta em [stripe.com](https://stripe.com)
2. Vá em "Developers > API Keys"
3. Copie as chaves de teste
4. Configure webhook: `https://seu-site.vercel.app/api/stripe/webhook`

## 📊 **Funcionalidades**

### **Para Visitantes**
- Visualizar posts públicos
- Ver preview de conteúdo exclusivo
- Cadastrar-se para trial gratuito

### **Para Assinantes**
- Acesso completo a todos os posts
- Conteúdo exclusivo
- Assinatura mensal automática

### **Para Administradores**
- Criar e editar posts
- Gerenciar assinaturas
- Visualizar analytics

## 🎯 **Deploy Simplificado**

Este projeto usa **SQLite** para facilitar o deploy:

### **Vantagens:**
- ✅ Zero configuração de banco
- ✅ Deploy em 5 minutos
- ✅ Gratuito
- ✅ Stripe funcionando normalmente

### **Limitações:**
- ⚠️ Não ideal para milhares de usuários
- ⚠️ Não funciona com múltiplos servidores

**Perfeito para MVP e projetos pequenos/médios!**

## 🔄 **Comandos Úteis**

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Rodar em produção
npm start

# Banco de dados
npx prisma studio          # Interface visual do banco
npx prisma migrate dev     # Criar migração
npx prisma generate        # Gerar cliente Prisma

# Seed do banco
npx tsx scripts/seed-posts.ts
```

## 📈 **Próximos Passos**

- [ ] Analytics de posts
- [ ] Sistema de comentários
- [ ] Notificações por email
- [ ] App mobile
- [ ] Migração para PostgreSQL (quando necessário)

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**🎉 Deploy em 5 minutos, Stripe funcionando, zero configuração de banco!**
