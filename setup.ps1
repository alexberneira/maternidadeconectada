Write-Host "🚀 Setup da Plataforma Maternidade" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# Verificar se Docker está rodando
$dockerOk = $true
try {
    docker info | Out-Null
} catch {
    $dockerOk = $false
}
if (-not $dockerOk) {
    Write-Host "❌ Docker não está rodando. Por favor, inicie o Docker e tente novamente." -ForegroundColor Red
    exit 1
}

# Parar e remover container existente se houver
Write-Host "📦 Configurando banco de dados PostgreSQL..." -ForegroundColor Yellow
docker stop maternidadejs-postgres 2>$null
docker rm maternidadejs-postgres 2>$null

# Criar novo container PostgreSQL
docker run --name maternidadejs-postgres `
    -e POSTGRES_PASSWORD=senha `
    -e POSTGRES_DB=maternidadejs `
    -e POSTGRES_USER=postgres `
    -p 5432:5432 `
    -d postgres

Write-Host "✅ Banco de dados iniciado!" -ForegroundColor Green

# Aguardar banco ficar pronto
Write-Host "⏳ Aguardando banco de dados ficar pronto..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Verificar se .env existe
if (-not (Test-Path ".env")) {
    Write-Host "📝 Criando arquivo .env..." -ForegroundColor Yellow
    $authSecret = -join ((65..90) + (97..122) | Get-Random -Count 32 | % { [char]$_ })
    $envContent = @"
# Database
DATABASE_URL=\"postgresql://postgres:senha@localhost:5432/maternidadejs\"

# NextAuth
NEXTAUTH_SECRET=\"$authSecret\"
NEXTAUTH_URL=\"http://localhost:3000\"

# Stripe (configure suas chaves reais)
STRIPE_SECRET_KEY=\"sk_test_...\"
STRIPE_PUBLISHABLE_KEY=\"pk_test_...\"
STRIPE_WEBHOOK_SECRET=\"whsec_...\"
STRIPE_PRICE_ID=\"price_xxx\"

# Vercel Blob (configure sua chave real)
BLOB_READ_WRITE_TOKEN=\"vercel_blob_rw_...\"
"@
    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ Arquivo .env criado!" -ForegroundColor Green
    Write-Host "⚠️  IMPORTANTE: Configure suas chaves do Stripe e Vercel Blob no arquivo .env" -ForegroundColor Yellow
}

# Instalar dependências
Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
npm install

# Rodar migrations
Write-Host "🗄️  Executando migrations do banco..." -ForegroundColor Yellow
npx prisma migrate dev --name init

# Gerar cliente Prisma
Write-Host "🔧 Gerando cliente Prisma..." -ForegroundColor Yellow
npx prisma generate

Write-Host ''
Write-Host '🎉 Setup concluído!' -ForegroundColor Green
Write-Host ''
Write-Host '📋 Próximos passos:' -ForegroundColor Cyan
Write-Host '1. Configure suas chaves do Stripe e Vercel Blob no arquivo .env'
Write-Host '2. Execute: npm run dev'
Write-Host '3. Acesse: http://localhost:3000'
Write-Host ''
Write-Host '🔑 Para parar o banco: docker stop maternidadejs-postgres' -ForegroundColor Gray
Write-Host '🔑 Para remover o banco: docker rm maternidadejs-postgres' -ForegroundColor Gray 