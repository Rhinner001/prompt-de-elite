import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Para imagens locais em /public/images/testimonials/ não precisa configurar domains
    // Se futuramente usar CDN externo, adicione aqui:
    // domains: ['exemplo.com', 'cdn.exemplo.com'],
    
    // Configurações de otimização
    formats: ['image/webp', 'image/avif'], // Formatos modernos para melhor performance
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Breakpoints responsivos
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Tamanhos para imagens pequenas como avatares
    
    // Configuração para desenvolvimento
    dangerouslyAllowSVG: false, // Segurança
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // CSP para SVGs
  },
  
  // Outras configurações úteis para o projeto
  experimental: {
    optimizePackageImports: ['lucide-react'], // Se usar ícones
  },
  
  // Configurações de build
  typescript: {
    ignoreBuildErrors: false, // Manter verificação TypeScript
  },
  
  eslint: {
    ignoreDuringBuilds: false, // Manter verificação ESLint
  },
};

export default nextConfig;
