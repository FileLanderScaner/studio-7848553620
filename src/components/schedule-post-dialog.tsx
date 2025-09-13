'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { ScheduledPost } from '@/lib/scheduled-posts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type NewPostState = {
  title: string;
  time: string;
  platform: string;
  imageUrl: string;
  imageHint: string;
  type: string;
};

const initialNewPostState: NewPostState = {
  title: '',
  time: '10:00',
  platform: 'Instagram',
  imageUrl: '',
  imageHint: 'abstract',
  type: 'text',
};

type SchedulePostDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSchedulePost: (post: Omit<ScheduledPost, 'id' | 'likes' | 'comments' | 'shares'>) => void;
  selectedDate?: Date;
  initialData?: Partial<NewPostState>;
};

export function SchedulePostDialog({
  isOpen,
  onOpenChange,
  onSchedulePost,
  selectedDate: initialSelectedDate,
  initialData,
}: SchedulePostDialogProps) {
  const [newPost, setNewPost] = useState<NewPostState>(initialNewPostState);

  useEffect(() => {
    if (isOpen) {
        const defaultTime = new Date();
        defaultTime.setHours(10, 0, 0, 0);

        setNewPost({
            title: initialData?.title || '',
            time: initialData?.time || format(defaultTime, 'HH:mm'),
            platform: initialData?.platform || 'Instagram',
            imageUrl: initialData?.imageUrl || '',
            imageHint: initialData?.imageHint || 'abstract',
            type: initialData?.type || 'text',
        });
    }
  }, [initialData, isOpen]);
  
  const handleInputChange = (field: keyof NewPostState, value: string) => {
    setNewPost((prev) => ({ ...prev, [field]: value }));
  };

  const handleSchedule = () => {
    const selectedDate = initialSelectedDate || new Date();
    const [hours, minutes] = newPost.time.split(':').map(Number);
    const newDate = new Date(selectedDate);
    newDate.setHours(hours, minutes);

    onSchedulePost({
      title: newPost.title,
      type: newPost.imageUrl ? 'Imagen' : 'Texto',
      date: newDate,
      platform: newPost.platform,
      image: newPost.imageUrl || `https://picsum.photos/seed/post${Math.random()}/200/200`,
      imageHint: newPost.imageHint || 'abstract',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              value={newPost.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="col-span-3"
              placeholder="Ej: Mi nuevo post increíble"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="platform" className="text-right">
              Plataforma
            </Label>
            <Select
              value={newPost.platform}
              onValueChange={(value) => handleInputChange('platform', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona una plataforma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="Facebook">Facebook</SelectItem>
                <SelectItem value="TikTok">TikTok</SelectItem>
                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                <SelectItem value="Twitter">Twitter</SelectItem>
                <SelectItem value="Pinterest">Pinterest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Fecha
            </Label>
            <div className="col-span-3 text-sm">
              {initialSelectedDate ? format(initialSelectedDate, 'PPP', { locale: es }) : 'Hoy'}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Hora
            </Label>
            <Input
              id="time"
              type="time"
              value={newPost.time}
              onChange={(e) => handleInputChange('time', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageUrl" className="text-right">
              URL de Imagen
            </Label>
            <Input
              id="imageUrl"
              value={newPost.imageUrl}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              className="col-span-3"
              placeholder="Dejar en blanco para autogenerar"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageHint" className="text-right">
              Pista para IA
            </Label>
            <Input
              id="imageHint"
              value={newPost.imageHint}
              onChange={(e) => handleInputChange('imageHint', e.target.value)}
              className="col-span-3"
              placeholder="Ej: persona sonriendo"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleSchedule}>Programar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
