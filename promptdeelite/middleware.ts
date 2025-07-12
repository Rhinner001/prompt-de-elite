// middleware.ts (VERSÃO COMPLETA)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Verificar se tem token de autenticação
  const authToken = request.cookies.get('auth-token');
  const isAuthenticated = !!authToken;
  
  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/quiz', '/login', '/register', '/'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Se está tentando acessar rota protegida sem estar autenticado
  if (!isAuthenticated && !isPublicRoute) {
    // Redirecionar para quiz (nossa nova estratégia)
    return NextResponse.redirect(new URL('/quiz', request.url));
  }
  
  // Se está autenticado e tentando acessar login/register
  if (isAuthenticated && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
