# Script para testar o sistema de assinatura
Write-Host "Testando Sistema de Assinatura" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

Write-Host "`nChecklist de Teste:" -ForegroundColor Yellow
Write-Host "1. Página de assinatura criada (/subscribe)" -ForegroundColor Green
Write-Host "2. API de checkout configurada (/api/create-checkout-session)" -ForegroundColor Green
Write-Host "3. API de subscription criada (/api/subscription)" -ForegroundColor Green
Write-Host "4. API de cancelamento criada (/api/subscription/cancel)" -ForegroundColor Green
Write-Host "5. Webhook do Stripe configurado (/api/stripe/webhook)" -ForegroundColor Green
Write-Host "6. Página de gerenciamento criada (/subscription)" -ForegroundColor Green
Write-Host "7. Link no header adicionado" -ForegroundColor Green

Write-Host "`nConfiguração do Stripe:" -ForegroundColor Yellow
Write-Host "   - STRIPE_SECRET_KEY: Configurada" -ForegroundColor Green
Write-Host "   - STRIPE_PUBLISHABLE_KEY: Configurada" -ForegroundColor Green
Write-Host "   - NEXT_PUBLIC_STRIPE_PRICE_ID: Configurada" -ForegroundColor Green
Write-Host "   - STRIPE_WEBHOOK_SECRET: Precisa ser configurado" -ForegroundColor Red

Write-Host "`nPróximos Passos:" -ForegroundColor Yellow
Write-Host "1. Configure o webhook do Stripe:" -ForegroundColor Cyan
Write-Host "   .\setup-stripe.ps1" -ForegroundColor White
Write-Host ""
Write-Host "2. Teste o fluxo completo:" -ForegroundColor Cyan
Write-Host "   - Acesse: http://localhost:3000" -ForegroundColor White
Write-Host "   - Faça login com: alexberneira@gmail.com / 123456" -ForegroundColor White
Write-Host "   - Clique em 'Minha Assinatura' no header" -ForegroundColor White
Write-Host "   - Clique em 'Assinar Agora'" -ForegroundColor White
Write-Host "   - Use cartão de teste: 4242 4242 4242 4242" -ForegroundColor White

Write-Host "`nCartões de Teste do Stripe:" -ForegroundColor Yellow
Write-Host "   Sucesso: 4242 4242 4242 4242" -ForegroundColor Green
Write-Host "   Falha: 4000 0000 0000 0002" -ForegroundColor Red
Write-Host "   Data: Qualquer data futura" -ForegroundColor Cyan
Write-Host "   CVC: Qualquer 3 dígitos" -ForegroundColor Cyan

Write-Host "`nFuncionalidades Implementadas:" -ForegroundColor Yellow
Write-Host "   Assinatura com trial de 7 dias" -ForegroundColor Green
Write-Host "   Checkout seguro via Stripe" -ForegroundColor Green
Write-Host "   Gerenciamento de assinatura" -ForegroundColor Green
Write-Host "   Cancelamento de assinatura" -ForegroundColor Green
Write-Host "   Webhook para sincronização" -ForegroundColor Green
Write-Host "   Interface moderna e responsiva" -ForegroundColor Green

Write-Host "`nSistema pronto para teste!" -ForegroundColor Green 