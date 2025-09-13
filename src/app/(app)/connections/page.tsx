
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Instagram, Facebook, Linkedin, X, Youtube, Rss } from 'lucide-react';
import { cn } from '@/lib/utils';

const socialPlatforms = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'group-hover/card:text-[#E4405F]' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'group-hover/card:text-[#1877F2]' },
  { id: 'twitter', name: 'X (Twitter)', icon: X, color: 'group-hover/card:text-[#1DA1F2]' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'group-hover/card:text-[#0A66C2]' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'group-hover/card:text-[#FF0000]' },
  { id: 'blog', name: 'Blog (RSS)', icon: Rss, color: 'group-hover/card:text-[#FFA500]' },
];


export default function ConnectionsPage() {
    const [connected, setConnected] = useState<Record<string, boolean>>({
        facebook: true,
    });

    const toggleConnection = (id: string) => {
        setConnected(prev => ({ ...prev, [id]: !prev[id] }));
    };

  return (
    <div className="container mx-auto px-0">
      <PageHeader
        title="Conexiones de Redes Sociales"
        description="Conecta tus cuentas para empezar a programar y publicar contenido directamente."
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {socialPlatforms.map((platform) => (
            <Card key={platform.id} className="group/card transition-all hover:border-primary/50 hover:shadow-lg">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                             <platform.icon className={cn("h-8 w-8 text-muted-foreground transition-colors", platform.color)} />
                            <CardTitle>{platform.name}</CardTitle>
                        </div>
                        <Button 
                            variant={connected[platform.id] ? 'secondary' : 'default'}
                            onClick={() => toggleConnection(platform.id)}
                        >
                            {connected[platform.id] ? 'Desconectar' : 'Conectar'}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <CardDescription>
                        {connected[platform.id] 
                            ? `Conectado como @usuario. Permitiendo la publicación automática.`
                            : `Autoriza a Contenido Maestro a publicar en tu nombre.`
                        }
                    </CardDescription>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
