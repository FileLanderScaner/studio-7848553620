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
    // If the initial auth load is finished and there is no user,
    // redirect them to the login page.
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // While the user's auth state is loading, show a global loading screen.
  // This prevents a flash of protected content or a premature redirect.
  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Cargando...</p>
      </div>
    );
  }

  // If the user is authenticated and the loading is complete, render the app layout.
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
