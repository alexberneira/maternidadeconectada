# 🚀 Como Criar o Repositório no GitHub

## Passo a Passo para Enviar o Projeto para o GitHub

### 1. Criar o Repositório no GitHub

1. Acesse [github.com](https://github.com) e faça login
2. Clique no botão **"New"** ou **"+"** no canto superior direito
3. Selecione **"New repository"**
4. Preencha os dados:
   - **Repository name**: `plataforma-maternidade` (ou o nome que preferir)
   - **Description**: `Plataforma moderna de conteúdo sobre maternidade com Next.js, Prisma e Stripe`
   - **Visibility**: Public (ou Private se preferir)
   - **NÃO** marque "Add a README file" (já temos um)
   - **NÃO** marque "Add .gitignore" (já temos um)
   - **NÃO** marque "Choose a license" (pode adicionar depois)
5. Clique em **"Create repository"**

### 2. Conectar o Repositório Local ao GitHub

Após criar o repositório, o GitHub mostrará comandos. Use estes comandos no terminal:

```bash
# Adicionar o remote do GitHub
git remote add origin https://github.com/SEU_USUARIO/plataforma-maternidade.git

# Enviar o código para o GitHub
git branch -M main
git push -u origin main
```

### 3. Verificar se Funcionou

1. Acesse seu repositório no GitHub
2. Você deve ver todos os arquivos do projeto
3. O README.md deve aparecer na página inicial

### 4. Configurar Deploy Automático (Opcional)

#### Para Vercel:
1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"New Project"**
3. Importe o repositório do GitHub
4. Configure as variáveis de ambiente
5. Deploy automático!

#### Para Netlify:
1. Acesse [netlify.com](https://netlify.com)
2. Clique em **"New site from Git"**
3. Conecte com GitHub
4. Configure as variáveis de ambiente

## 📋 Checklist Final

- [ ] Repositório criado no GitHub
- [ ] Código enviado com sucesso
- [ ] README.md aparece na página inicial
- [ ] Todos os arquivos estão presentes
- [ ] .gitignore está funcionando (não há arquivos sensíveis)

## 🔧 Comandos Úteis

```bash
# Verificar status do Git
git status

# Verificar remotes configurados
git remote -v

# Verificar branches
git branch -a

# Fazer push de mudanças futuras
git push

# Fazer pull de mudanças do GitHub
git pull
```

## 🆘 Solução de Problemas

### Erro de autenticação:
```bash
# Configurar credenciais do GitHub
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

### Erro de push:
```bash
# Forçar push (use com cuidado)
git push -f origin main
```

### Repositório já existe:
```bash
# Remover remote atual
git remote remove origin

# Adicionar novo remote
git remote add origin https://github.com/SEU_USUARIO/novo-nome.git
```

## 🎉 Próximos Passos

1. **Configurar Deploy**: Conecte com Vercel/Netlify
2. **Configurar Stripe**: Adicione suas chaves de API
3. **Configurar Banco**: Use PostgreSQL na nuvem
4. **Personalizar**: Adapte cores, textos e funcionalidades
5. **Testar**: Verifique se tudo funciona em produção

---

**🎯 Dica**: Mantenha o repositório público para que outros desenvolvedores possam contribuir e aprender com seu projeto! 