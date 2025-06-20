#!/bin/bash

echo "🚀 Setup da Plataforma Maternidade"
echo "=================================="

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker e tente novamente."
    exit 1
fi

# Parar e remover container existente se houver
echo "📦 Configurando banco de dados PostgreSQL..."
docker stop maternidadejs-postgres 2>/dev/null || true
docker rm maternidadejs-postgres 2>/dev/null || true

# Criar novo container PostgreSQL
docker run --name maternidadejs-postgres \
    -e POSTGRES_PASSWORD=senha \
    -e POSTGRES_DB=maternidadejs \
    -e POSTGRES_USER=postgres \
    -p 5432:5432 \
    -d postgres

echo "✅ Banco de dados iniciado!"

# Aguardar banco ficar pronto
echo "⏳ Aguardando banco de dados ficar pronto..."
sleep 5

# Verificar se .env existe
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cat > .env << EOF
# Database
DATABASE_URL="postgresql://postgres:senha@localhost:5432/maternidadejs"

# NextAuth
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"

# Stripe (configure suas chaves reais)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_ID="price_xxx"

# Vercel Blob (configure sua chave real)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
EOF
    echo "✅ Arquivo .env criado!"
    echo "⚠️  IMPORTANTE: Configure suas chaves do Stripe e Vercel Blob no arquivo .env"
else
    echo "✅ Arquivo .env já existe"
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Rodar migrations
echo "🗄️  Executando migrations do banco..."
npx prisma migrate dev --name init

# Gerar cliente Prisma
echo "🔧 Gerando cliente Prisma..."
npx prisma generate

echo ""
echo "🎉 Setup concluído!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure suas chaves do Stripe e Vercel Blob no arquivo .env"
echo "2. Execute: npm run dev"
echo "3. Acesse: http://localhost:3000"
echo ""
echo "🔑 Para parar o banco: docker stop maternidadejs-postgres"
echo "🔑 Para remover o banco: docker rm maternidadejs-postgres" 