# Script para verificar e criar usuário no banco de produção
Write-Host "🔍 Verificando usuário no banco de produção..." -ForegroundColor Yellow

# Verificar se o arquivo .env existe
if (-not (Test-Path ".env")) {
    Write-Host "❌ Arquivo .env não encontrado!" -ForegroundColor Red
    Write-Host "Por favor, crie um arquivo .env com as variáveis de produção:" -ForegroundColor Yellow
    Write-Host "DATABASE_URL=sua_url_do_supabase" -ForegroundColor Cyan
    Write-Host "NEXTAUTH_SECRET=seu_secret" -ForegroundColor Cyan
    Write-Host "NEXTAUTH_URL=https://maternidadeconectada.vercel.app" -ForegroundColor Cyan
    exit 1
}

# Executar o script TypeScript
Write-Host "🚀 Executando verificação do usuário..." -ForegroundColor Green
npx tsx scripts/check-production-user.ts

Write-Host "✅ Verificação concluída!" -ForegroundColor Green
Write-Host "Agora tente fazer login novamente em: https://maternidadeconectada.vercel.app/login" -ForegroundColor Cyan 