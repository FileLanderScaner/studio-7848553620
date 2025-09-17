'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { runGenkitFlow } from '@/lib/genkit';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/page-header';

function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [message, setMessage] = useState('Procesando autenticación...');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const platform = searchParams.get('platform');

      if (!code || !state || !platform) {
        setMessage('Error: Faltan parámetros en la URL de callback.');
        toast({ title: 'Error de Autenticación', description: 'La URL de respuesta no es válida.', variant: 'destructive' });
        return;
      }

      try {
        const result = await runGenkitFlow<any, { success: boolean }>('oauthCallbackFlow', { code, state, platform });

        if (result.success) {
          toast({ title: '¡Conexión Exitosa!', description: `Tu cuenta de ${platform} ha sido conectada.` });
          router.push('/connections');
        } else {
          throw new Error('El flujo de callback de OAuth ha fallado.');
        }
      } catch (error) {
        console.error('OAuth callback failed', error);
        setMessage(`Error al conectar con ${platform}. Por favor, inténtalo de nuevo.`);
        toast({ title: 'Error de Conexión', description: `No se pudo completar la conexión con ${platform}.`, variant: 'destructive' });
        // Optionally redirect to connections page after a delay
        setTimeout(() => router.push('/connections'), 3000);
      }
    };

    handleOAuthCallback();
  }, [searchParams, router, toast]);

  return (
    <div className="container mx-auto px-4">
      <PageHeader
        title="Conectando tu Cuenta"
        description={message}
      />
    </div>
  );
}

export default function OAuthCallbackPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <OAuthCallback />
        </Suspense>
    )
}
