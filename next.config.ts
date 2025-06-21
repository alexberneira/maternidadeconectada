import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurações para melhorar o build
  experimental: {
    // Otimizações para produção
    optimizePackageImports: ['@prisma/client'],
  },
  
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
};

export default nextConfig;
