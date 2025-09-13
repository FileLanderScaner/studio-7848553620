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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { scheduledPosts as initialScheduledPosts, ScheduledPost } from '@/lib/scheduled-posts';

const optimalTimes = [
  { platform: 'Instagram', time: '9:00 AM - 11:00 AM' },
  { platform: 'Facebook', time: '1:00 PM - 3:00 PM' },
  { platform: 'TikTok', time: '6:00 PM - 9:00 PM' },
  { platform: 'LinkedIn', time: '10:00 AM - 12:00 PM' },
];

export default function SchedulePage() {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(initialScheduledPosts);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostTime, setNewPostTime] = useState('10:00');

  const handleSchedulePost = () => {
    if (newPostTitle && selectedDate) {
      const [hours, minutes] = newPostTime.split(':').map(Number);
      const newDate = new Date(selectedDate);
      newDate.setHours(hours, minutes);

      const newPost: ScheduledPost = {
        id: scheduledPosts.length + 1,
        title: newPostTitle,
        type: 'Texto',
        date: newDate,
        platform: 'Twitter',
        image: `https://picsum.photos/seed/post${scheduledPosts.length + 1}/200/200`,
        imageHint: 'abstract text',
        likes: Math.floor(Math.random() * 200),
        comments: Math.floor(Math.random() * 50),
        shares: Math.floor(Math.random() * 30),
      };
      setScheduledPosts(prevPosts => [...prevPosts, newPost].sort((a,b) => a.date.getTime() - b.date.getTime()));
      setIsModalOpen(false);
      setNewPostTitle('');
      setNewPostTime('10:00');
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
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nueva Publicación
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Programar Nueva Publicación</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Título
                </Label>
                <Input
                  id="title"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="col-span-3"
                  placeholder="Ej: Mi nuevo post increíble"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Fecha
                </Label>
                <div className="col-span-3 text-sm">
                   {selectedDate ? format(selectedDate, 'PPP', { locale: es }) : 'Selecciona una fecha'}
                </div>
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">
                  Hora
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={newPostTime}
                  onChange={(e) => setNewPostTime(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button onClick={handleSchedulePost}>Programar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
