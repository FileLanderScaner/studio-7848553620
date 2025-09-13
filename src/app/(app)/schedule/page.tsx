'use client';

import { useState } from 'react';
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
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { ScheduledPost } from '@/lib/scheduled-posts';
import { useToast } from '@/hooks/use-toast';
import { SchedulePostDialog } from '@/components/schedule-post-dialog';

const optimalTimes = [
  { platform: 'Instagram', time: '9:00 AM - 11:00 AM' },
  { platform: 'Facebook', time: '1:00 PM - 3:00 PM' },
  { platform: 'TikTok', time: '6:00 PM - 9:00 PM' },
  { platform: 'LinkedIn', time: '10:00 AM - 12:00 PM' },
];

type SchedulePageProps = {
    scheduledPosts: ScheduledPost[];
    handleSchedulePost: (post: Omit<ScheduledPost, 'id' | 'likes' | 'comments' | 'shares'>) => void;
};

export default function SchedulePage({ scheduledPosts = [], handleSchedulePost }: SchedulePageProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const onSchedulePost = (newPost: Omit<ScheduledPost, 'id' | 'likes' | 'comments' | 'shares'>) => {
    if (selectedDate) {
      const [hours, minutes] = (newPost.date.toString()).split(':').map(Number);
      const finalDate = new Date(selectedDate);
      finalDate.setHours(hours, minutes);

      const postWithDate = {
        ...newPost,
        date: finalDate,
      };

      handleSchedulePost(postWithDate);
      setIsModalOpen(false);
      toast({
        title: '¡Publicación programada!',
        description: 'Tu contenido ha sido añadido al calendario.',
      });
    }
  };
  
  const scheduledDays = scheduledPosts.map(post => post.date);

  return (
    <div className="container mx-auto px-0">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PageHeader
          title="Calendario de Contenido"
          description="Organiza y programa tus publicaciones fácilmente."
          className="mb-0"
        />
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nueva Publicación
        </Button>
        <SchedulePostDialog
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSchedulePost={onSchedulePost}
          selectedDate={selectedDate}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-2 md:p-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full rounded-md"
                modifiers={{ scheduled: scheduledDays }}
                modifiersClassNames={{
                  scheduled: 'bg-primary/20 text-primary-foreground rounded-full',
                }}
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
                {scheduledPosts.filter(post => post.date >= new Date()).map((post) => (
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
                        {format(post.date, "EEEE, h:mm a", { locale: es })}
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
