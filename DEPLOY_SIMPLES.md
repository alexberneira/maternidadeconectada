# 🚀 Deploy Super Simples

## 🎯 **Opção 1: Vercel (Recomendado)**

### **Passo 1: Criar conta**
1. Acesse https://vercel.com
2. Clique em "Sign Up" com GitHub
3. Autorize o acesso

### **Passo 2: Deploy**
1. Clique em "New Project"
2. Selecione: `alexberneira/maternidadeconectada`
3. Clique em "Import"

### **Passo 3: Configurar (2 minutos)**
Na tela de configuração, adicione apenas:

```env
DATABASE_URL="postgresql://postgres:[SUA_SENHA]@db.[PROJETO].supabase.co:5432/postgres"
NEXTAUTH_SECRET="s4VGFkbAtMSSXThcIWEzyFzHcaXf2SUqb+94S/Fa9lg="
NEXTAUTH_URL="https://seu-projeto.vercel.app"
```

### **Passo 4: Deploy**
- Clique em "Deploy"
- Aguarde 2 minutos
- Pronto! 🎉

---

## 🌐 **Opção 2: Netlify (Ainda mais simples)**

### **Passo 1: Build local**
```bash
npm run build
```

### **Passo 2: Deploy**
1. Acesse https://netlify.com
2. Arraste a pasta `.next` para o site
3. Pronto! 🎉

---

## ☁️ **Opção 3: Railway (Tudo incluído)**

### **Passo 1: Criar conta**
1. Acesse https://railway.app
2. Conecte com GitHub

### **Passo 2: Deploy**
1. Clique em "New Project"
2. Selecione "Deploy from GitHub repo"
3. Selecione o repositório
4. Pronto! 🎉

---

## 🎯 **Qual escolher?**

- **Vercel**: Melhor para Next.js, deploy automático
- **Netlify**: Mais simples, mas precisa de build manual
- **Railway**: Tudo incluído, mas pago

## 💡 **Recomendação: Vercel**

É o mais fácil e funciona perfeitamente com Next.js! 