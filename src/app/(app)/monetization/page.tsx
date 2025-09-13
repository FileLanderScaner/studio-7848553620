'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const initialPlans = [
  {
    id: 'free',
    name: 'Gratis',
    price: '$0',
    description: 'Para empezar a explorar el poder de la IA.',
    features: [
      '10 generaciones de texto/mes',
      '5 generaciones de imagen/mes',
      'Análisis básico',
      'Programación de hasta 5 posts',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19',
    description: 'Para creadores de contenido y freelancers.',
    features: [
      'Generaciones de texto ilimitadas',
      '100 generaciones de imagen/mes',
      '10 generaciones de video/mes',
      'Análisis avanzado',
      'Programación ilimitada',
      'Soporte prioritario',
    ],
    isPopular: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: '$49',
    description: 'Para equipos y agencias que buscan escalar.',
    features: [
      'Todo en Pro',
      'Colaboración en equipo (hasta 5 usuarios)',
      'Generaciones de video ilimitadas',
      'API de acceso',
      'Manager de cuenta dedicado',
    ],
  },
];

const premiumContent = [
  {
    title: 'Curso Avanzado de SEO para Contenido IA',
    description: 'Domina las técnicas para posicionar tu contenido generado por IA.',
  },
  {
    title: 'Estrategias de Viralización en TikTok',
    description: 'Aprende a crear videos cortos que capturen la atención.',
  },
];

export default function MonetizationPage() {
  const [currentPlanId, setCurrentPlanId] = useState('free');
  const { toast } = useToast();

  const handleSubscribe = (planId: string) => {
    if (planId === 'business') {
      window.location.href = "mailto:contacto@contenidomaestro.com?subject=Consulta sobre el plan Business";
      toast({
        title: 'Contactando a Ventas',
        description: 'Se abrirá tu cliente de correo para contactar con nuestro equipo.',
      });
      return;
    }
    setCurrentPlanId(planId);
    toast({
      title: '¡Suscripción Exitosa!',
      description: 'Has actualizado tu plan a Pro.',
    });
  };

  const isPro = currentPlanId === 'pro' || currentPlanId === 'business';

  return (
    <div className="container mx-auto px-0">
      <PageHeader
        title="Monetiza tu Contenido"
        description="Elige el plan que mejor se adapte a tus necesidades."
      />

      <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {initialPlans.map((plan) => (
          <Card
            key={plan.name}
            className={`flex flex-col ${plan.isPopular ? 'border-2 border-primary shadow-lg' : ''}`}
          >
            {plan.isPopular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                Más Popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div>
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/mes</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="mr-2 mt-1 h-4 w-4 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={currentPlanId === plan.id ? 'outline' : 'default'}
                disabled={currentPlanId === plan.id}
                onClick={() => handleSubscribe(plan.id)}
              >
                {plan.id === 'business' ? 'Contactar para Venta' : currentPlanId === plan.id ? 'Plan Actual' : 'Suscribirse'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="mb-6 text-2xl font-bold tracking-tight">
          Contenido Premium
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {premiumContent.map((item) => (
            <Card
              key={item.title}
              className="relative overflow-hidden"
            >
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="secondary" disabled={isPro} onClick={() => handleSubscribe('pro')}>
                  <Lock className="mr-2 h-4 w-4" />
                  {isPro ? 'Desbloqueado' : 'Desbloquear con Pro'}
                </Button>
              </CardFooter>
              {!isPro && (
                 <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center p-4">
                       <Lock className="mx-auto h-12 w-12 text-primary" />
                       <p className="mt-2 font-semibold">Contenido Bloqueado</p>
                       <p className="text-sm text-muted-foreground">Actualiza a Pro para acceder.</p>
                    </div>
                 </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
