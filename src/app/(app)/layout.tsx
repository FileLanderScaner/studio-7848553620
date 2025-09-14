'use client';

import React, { useEffect } from 'react';
import { AppSidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { SidebarInset } from '@/components/ui/sidebar';
import { ScheduledPostsProvider } from '@/contexts/ScheduledPostsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si la carga ha terminado y no hay usuario, redirigir a login.
    // Esto asegura que las rutas protegidas no se muestren a usuarios no autenticados.
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Mientras se verifica el estado del usuario, muestra una pantalla de carga.
  // Esto previene mostrar contenido protegido o redirigir prematuramente.
  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Cargando...</p>
      </div>
    );
  }

  // Si el usuario está autenticado y la carga ha finalizado, renderiza el layout de la aplicación.
  return (
    <ScheduledPostsProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 lg:p-6 animate-in fade-in duration-500">
          {children}
        </main>
      </SidebarInset>
    </ScheduledPostsProvider>
  );
}
