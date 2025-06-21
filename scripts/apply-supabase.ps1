# Script para aplicar migrações no Supabase
# Execute este script após configurar a DATABASE_URL no .env

Write-Host "🚀 Aplicando migrações no Supabase..." -ForegroundColor Green
Write-Host ""

# Verificar se o arquivo .env existe
if (-not (Test-Path ".env")) {
    Write-Host "❌ Arquivo .env não encontrado!" -ForegroundColor Red
    Write-Host "Execute primeiro: .\scripts\supabase-setup.ps1" -ForegroundColor Yellow
    exit 1
}

# Verificar se DATABASE_URL está configurada
$envContent = Get-Content ".env"
$databaseUrl = $envContent | Where-Object { $_ -match "^DATABASE_URL=" }
if (-not $databaseUrl -or $databaseUrl -match "localhost") {
    Write-Host "❌ DATABASE_URL não configurada ou ainda apontando para localhost!" -ForegroundColor Red
    Write-Host "Configure a URL do Supabase no arquivo .env" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ DATABASE_URL configurada" -ForegroundColor Green
Write-Host ""

# Aplicar migrações
Write-Host "📊 Aplicando schema do banco..." -ForegroundColor Yellow
try {
    npx prisma db push --force-reset
    Write-Host "✅ Schema aplicado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao aplicar schema: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Gerar Prisma Client
Write-Host "🔧 Gerando Prisma Client..." -ForegroundColor Yellow
try {
    npx prisma generate
    Write-Host "✅ Prisma Client gerado!" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao gerar Prisma Client: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Inserir dados de teste
Write-Host "🌱 Inserindo dados de teste..." -ForegroundColor Yellow
try {
    npm run seed
    Write-Host "✅ Dados de teste inseridos!" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao inserir dados de teste: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Configuração do Supabase concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Para iniciar o servidor:" -ForegroundColor Cyan
Write-Host "npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "📊 Para verificar as tabelas no Supabase:" -ForegroundColor Cyan
Write-Host "1. Acesse o dashboard do Supabase" -ForegroundColor White
Write-Host "2. Vá em Table Editor" -ForegroundColor White
Write-Host "3. Verifique se as tabelas users, posts, subscriptions e payments foram criadas" -ForegroundColor White
