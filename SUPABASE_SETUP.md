# Configuração do Supabase

Este guia te ajudará a configurar o Supabase como banco de dados para o projeto Maternidade Conectada.

## 1. Criar conta no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Faça login com GitHub ou crie uma conta
4. Clique em "New Project"

## 2. Configurar o Projeto

### 2.1 Informações do Projeto
- **Nome**: maternidade-conectada
- **Database Password**: Crie uma senha forte (ex: `maternidade2024!`)
- **Region**: Escolha a região mais próxima (ex: São Paulo - Brazil)

### 2.2 Aguardar Setup
O Supabase levará alguns minutos para configurar o projeto.

## 3. Obter Credenciais

### 3.1 Database URL
1. No dashboard do Supabase, vá em **Settings** → **Database**
2. Role até "Connection string"
3. Selecione "URI" 
4. Copie a string que começa com `postgresql://postgres:[YOUR-PASSWORD]@...`

### 3.2 API Keys
1. Vá em **Settings** → **API**
2. Copie:
   - **Project URL** (ex: `https://your-project.supabase.co`)
   - **anon public** key
   - **service_role** key (mantenha segura)

## 4. Configurar Variáveis de Ambiente

### 4.1 Criar arquivo .env
```bash
# Copie o env.example
cp env.example .env
```

### 4.2 Editar .env
```env
# Database (Substitua pela URL do Supabase)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Vercel Blob
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# Supabase (Opcional - para funcionalidades extras)
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"
```

## 5. Executar Migrações

### 5.1 Reset do banco (se necessário)
```bash
# Reset completo do banco
npx prisma db push --force-reset
```

### 5.2 Aplicar schema
```bash
# Aplicar o schema atual
npx prisma db push
```

### 5.3 Gerar Prisma Client
```bash
# Gerar cliente atualizado
npx prisma generate
```

## 6. Inserir Dados de Teste

### 6.1 Executar seed
```bash
# Executar script de seed
npm run seed
```

## 7. Testar Conexão

### 7.1 Verificar no Supabase Dashboard
1. Vá em **Table Editor**
2. Verifique se as tabelas foram criadas:
   - `users`
   - `subscriptions`
   - `posts`
   - `payments`

### 7.2 Testar localmente
```bash
# Iniciar servidor
npm run dev
```

## 8. Configurar para Produção (Vercel)

### 8.1 Variáveis no Vercel
Quando fizer deploy no Vercel, configure estas variáveis:

- `DATABASE_URL` = URL do Supabase
- `NEXTAUTH_SECRET` = Chave secreta
- `NEXTAUTH_URL` = URL do seu domínio
- `STRIPE_SECRET_KEY` = Chave do Stripe
- `STRIPE_PUBLISHABLE_KEY` = Chave pública do Stripe
- `STRIPE_WEBHOOK_SECRET` = Webhook do Stripe
- `BLOB_READ_WRITE_TOKEN` = Token do Vercel Blob

### 8.2 Deploy
```bash
# Fazer deploy
vercel --prod
```

## 9. Configurações Adicionais do Supabase

### 9.1 Row Level Security (RLS)
O Supabase usa RLS por padrão. Para o projeto funcionar:

1. Vá em **Authentication** → **Policies**
2. Para cada tabela, crie políticas básicas:

**Tabela `users`:**
```sql
-- Permitir usuários verem apenas seus próprios dados
CREATE POLICY "Users can view own data" ON users
FOR SELECT USING (auth.uid()::text = id);
```

**Tabela `posts`:**
```sql
-- Permitir todos verem posts publicados
CREATE POLICY "Posts are viewable by everyone" ON posts
FOR SELECT USING (is_published = true);

-- Permitir autores editarem seus posts
CREATE POLICY "Authors can edit own posts" ON posts
FOR ALL USING (auth.uid()::text = author_id);
```

### 9.2 Configurar Email (Opcional)
1. Vá em **Authentication** → **Settings**
2. Configure SMTP para emails de confirmação

## 10. Troubleshooting

### 10.1 Erro de Conexão
- Verifique se a URL do banco está correta
- Confirme se o IP está liberado (Settings → Database → Connection pooling)

### 10.2 Erro de Permissão
- Verifique as políticas RLS
- Use o service_role key para operações admin

### 10.3 Erro de Migração
```bash
# Reset completo
npx prisma migrate reset
npx prisma db push
```

## 11. Vantagens do Supabase

✅ **Hosting gratuito** - 500MB de banco, 2GB de transferência
✅ **Backup automático** - Diário
✅ **Interface web** - Dashboard intuitivo
✅ **Escalabilidade** - Fácil upgrade
✅ **Integração** - Funciona perfeitamente com Vercel
✅ **Real-time** - Suporte a WebSockets
✅ **Auth** - Sistema de autenticação integrado

## 12. Próximos Passos

1. ✅ Configurar Supabase
2. ✅ Testar localmente
3. ✅ Fazer deploy no Vercel
4. ✅ Configurar domínio personalizado
5. ✅ Configurar Stripe para produção
6. ✅ Configurar webhooks

---

**Precisa de ajuda?** Verifique os logs no dashboard do Supabase ou consulte a documentação oficial.
