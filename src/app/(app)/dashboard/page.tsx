'use client';

import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import {
  ArrowRight,
  BarChart,
  Calendar,
  CreditCard,
  Sparkles,
  MessageSquare,
  Share2,
  ThumbsUp,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useScheduledPosts } from '@/contexts/ScheduledPostsContext';


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
  const { scheduledPosts, loading } = useScheduledPosts();

  const likes = scheduledPosts.reduce((acc, post) => acc + (post.likes || 0), 0);
  const comments = scheduledPosts.reduce(
    (acc, post) => acc + (post.comments || 0),
    0
  );
  const shares = scheduledPosts.reduce((acc, post) => acc + (post.shares || 0), 0);
  
  const stats = [
    {
      icon: ThumbsUp,
      label: 'Likes Totales',
      value: likes.toLocaleString(),
    },
    {
      icon: MessageSquare,
      label: 'Comentarios Totales',
      value: comments.toLocaleString(),
    },
    {
      icon: Share2,
      label: 'Compartidos Totales',
      value: shares.toLocaleString(),
    },
  ];

  const upcomingPost = scheduledPosts
    .filter((post) => new Date(post.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
    
  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Cargando tu contenido...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-0">
      <PageHeader
        title="Bienvenido a Contenido Maestro"
        description="Tu centro de control para la creación y gestión de contenido."
      />
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-2">
          {features.map((feature) => (
            <Link href={feature.href} key={feature.href} className="group">
              <Card className="flex h-full flex-col justify-between transition-all duration-200 ease-in-out hover:border-primary hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <feature.icon className="mt-1 h-8 w-8 text-primary" />
                    <div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <div className="flex items-center justify-end p-4 pt-0">
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Próxima Publicación</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingPost ? (
                <div className="flex items-start gap-4">
                  <Image
                    src={upcomingPost.image}
                    alt={upcomingPost.title}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-md object-cover"
                    data-ai-hint={upcomingPost.imageHint}
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{upcomingPost.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(upcomingPost.date), "EEEE, h:mm a", {
                        locale: es,
                      })}
                    </p>
                    <Badge variant="outline">{upcomingPost.platform}</Badge>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No hay publicaciones programadas.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
