import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowRight,
  BarChart,
  Calendar,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    href: '/generate',
    icon: Sparkles,
    title: 'Generar Contenido',
    description: 'Crea nuevo contenido con el poder de la IA.',
  },
  {
    href: '/schedule',
    icon: Calendar,
    title: 'Programar Publicaciones',
    description: 'Organiza tu calendario de contenido.',
  },
  {
    href: '/analytics',
    icon: BarChart,
    title: 'Analizar Rendimiento',
    description: 'Mide el impacto de tus publicaciones.',
  },
  {
    href: '/monetization',
    icon: CreditCard,
    title: 'Monetizar',
    description: 'Explora planes de suscripción y contenido premium.',
  },
];

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-0">
      <PageHeader
        title="Bienvenido a Contenido Maestro"
        description="Tu centro de control para la creación y gestión de contenido."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {features.map((feature) => (
          <Link href={feature.href} key={feature.href} className="group">
            <Card className="flex h-full flex-col justify-between transition-all duration-200 ease-in-out hover:border-primary hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <div className="flex items-center justify-end p-4">
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
