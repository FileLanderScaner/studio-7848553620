import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Clock, MessageSquare, PlusCircle, ThumbsUp } from 'lucide-react';
import Image from 'next/image';

const scheduledPosts = [
  {
    id: 1,
    title: '5 tips para crecer en Instagram',
    type: 'Imagen',
    date: '2024-08-15T10:00:00',
    platform: 'Instagram',
    image: 'https://picsum.photos/seed/insta1/200/200',
    imageHint: 'social media flatlay',
  },
  {
    id: 2,
    title: 'Análisis del nuevo iPhone',
    type: 'Video',
    date: '2024-08-15T18:30:00',
    platform: 'YouTube',
    image: 'https://picsum.photos/seed/yt1/200/200',
    imageHint: 'tech gadget',
  },
  {
    id: 3,
    title: 'Cómo la IA está cambiando el marketing',
    type: 'Texto',
    date: '2024-08-16T09:00:00',
    platform: 'LinkedIn',
    image: 'https://picsum.photos/seed/li1/200/200',
    imageHint: 'business meeting',
  },
];

const optimalTimes = [
  { platform: 'Instagram', time: '9:00 AM - 11:00 AM' },
  { platform: 'Facebook', time: '1:00 PM - 3:00 PM' },
  { platform: 'TikTok', time: '6:00 PM - 9:00 PM' },
  { platform: 'LinkedIn', time: '10:00 AM - 12:00 PM' },
];

export default function SchedulePage() {
  return (
    <div className="container mx-auto px-0">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PageHeader
          title="Calendario de Contenido"
          description="Organiza y programa tus publicaciones fácilmente."
          className="mb-0"
        />
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nueva Publicación
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-2 md:p-6">
              <Calendar
                mode="single"
                selected={new Date()}
                className="w-full rounded-md"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Próximas Publicaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledPosts.map((post) => (
                  <div key={post.id} className="flex items-start gap-4">
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-md object-cover"
                      data-ai-hint={post.imageHint}
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{post.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(post.date).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <Badge variant="outline">{post.platform}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Horarios Óptimos Sugeridos</CardTitle>
              <CardDescription>
                Publica en estos horarios para mayor alcance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {optimalTimes.map((item) => (
                  <li key={item.platform} className="flex items-center justify-between">
                    <span className="font-medium">{item.platform}</span>
                    <span className="text-sm text-primary">{item.time}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
