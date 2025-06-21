# Script para configurar Supabase
# Execute este script após criar o projeto no Supabase

Write-Host "🚀 Configurando Supabase para Maternidade Conectada" -ForegroundColor Green
Write-Host ""

# Verificar se o arquivo .env existe
if (-not (Test-Path ".env")) {
    Write-Host "📝 Criando arquivo .env..." -ForegroundColor Yellow
    Copy-Item "env.example" ".env"
    Write-Host "✅ Arquivo .env criado!" -ForegroundColor Green
} else {
    Write-Host "✅ Arquivo .env já existe" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔧 Próximos passos:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Acesse https://supabase.com e crie um projeto" -ForegroundColor White
Write-Host "2. Copie a DATABASE_URL do dashboard (Settings → Database)" -ForegroundColor White
Write-Host "3. Edite o arquivo .env e substitua a DATABASE_URL" -ForegroundColor White
Write-Host "4. Execute os comandos abaixo:" -ForegroundColor White
Write-Host ""

Write-Host "📋 Comandos para executar:" -ForegroundColor Yellow
Write-Host "npx prisma db push --force-reset" -ForegroundColor Gray
Write-Host "npx prisma generate" -ForegroundColor Gray
Write-Host "npm run seed" -ForegroundColor Gray
Write-Host "npm run dev" -ForegroundColor Gray

Write-Host ""
Write-Host "💡 Dica: Use o comando 'code .env' para abrir o arquivo no VS Code" -ForegroundColor Cyan
Write-Host ""

# Perguntar se quer abrir o arquivo .env
$openEnv = Read-Host "Deseja abrir o arquivo .env agora? (s/n)"
if ($openEnv -eq "s" -or $openEnv -eq "S") {
    if (Get-Command "code" -ErrorAction SilentlyContinue) {
        code .env
        Write-Host "✅ Arquivo .env aberto no VS Code" -ForegroundColor Green
    } else {
        Write-Host "❌ VS Code não encontrado. Abra o arquivo .env manualmente" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎯 Quando terminar de configurar o .env, execute:" -ForegroundColor Green
Write-Host "npx prisma db push --force-reset" -ForegroundColor White 