import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurações para melhorar o build
  experimental: {
    // Otimizações para produção
    optimizePackageImports: ['@prisma/client'],
  },
  
  // Configuração para otimizar o Prisma
  transpilePackages: ['@prisma/client'],
  
  // Configurações de build
  typescript: {
    // Ignorar erros de TypeScript durante o build (opcional)
    ignoreBuildErrors: false,
  },
  
  // Configurações de ESLint
  eslint: {
    // Ignorar erros de ESLint durante o build (opcional)
    ignoreDuringBuilds: false,
  },
  
  // Configurações de imagens
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Configurações de ambiente
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        '@prisma/client': '@prisma/client',
        'prisma': 'prisma'
      })
    }
    return config
  }
};

export default nextConfig;
