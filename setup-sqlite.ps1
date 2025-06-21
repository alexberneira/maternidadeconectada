# Setup Simplificado - SQLite + Stripe
Write-Host "🚀 Setup Simplificado - Maternidade Conectada" -ForegroundColor Green
Write-Host ""

# 1. Instalar dependências
Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
npm install

# 2. Gerar Prisma Client
Write-Host "🔧 Gerando Prisma Client..." -ForegroundColor Yellow
npx prisma generate

# 3. Executar migrações
Write-Host "🗄️ Executando migrações..." -ForegroundColor Yellow
npx prisma migrate dev --name init

# 4. Popular banco com dados
Write-Host "🌱 Populando banco com posts..." -ForegroundColor Yellow
npx tsx scripts/seed-posts.ts

# 5. Gerar chave secreta para NextAuth
Write-Host "🔑 Gerando chave secreta para NextAuth..." -ForegroundColor Yellow
$secret = node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
Write-Host "NEXTAUTH_SECRET gerado: $secret" -ForegroundColor Cyan

Write-Host ""
Write-Host "✅ Setup concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Crie um arquivo .env na raiz do projeto" -ForegroundColor White
Write-Host "2. Adicione as variáveis de ambiente:" -ForegroundColor White
Write-Host "   DATABASE_URL='file:./dev.db'" -ForegroundColor Gray
Write-Host "   NEXTAUTH_SECRET='$secret'" -ForegroundColor Gray
Write-Host "   NEXTAUTH_URL='http://localhost:3000'" -ForegroundColor Gray
Write-Host "   STRIPE_SECRET_KEY='sk_test_...'" -ForegroundColor Gray
Write-Host "   STRIPE_PUBLISHABLE_KEY='pk_test_...'" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Execute: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Para deploy na Vercel:" -ForegroundColor Cyan
Write-Host "- Conecte o repositório GitHub" -ForegroundColor White
Write-Host "- Adicione as variáveis de ambiente" -ForegroundColor White
Write-Host "- Deploy automático!" -ForegroundColor White 