export type ScheduledPost = {
    id: string; // Changed to string to accommodate Firestore document IDs
    title: string;
    type: string;
    date: string;
    platform: string;
    image: string;
    imageHint: string;
    likes?: number;
    comments?: number;
    shares?: number;
}

// This data is now used to seed a new user's account
export const initialScheduledPosts: Omit<ScheduledPost, 'id'>[] = [
  {
    title: '5 tips para crecer en Instagram',
    type: 'Imagen',
    date: new Date('2024-08-15T10:00:00').toISOString(),
    platform: 'Instagram',
    image: 'https://picsum.photos/seed/insta1/200/200',
    imageHint: 'social media flatlay',
    likes: 152,
    comments: 23,
    shares: 12,
  },
  {
    title: 'Análisis del nuevo iPhone',
    type: 'Video',
    date: new Date('2024-08-15T18:30:00').toISOString(),
    platform: 'YouTube',
    image: 'https://picsum.photos/seed/yt1/200/200',
    imageHint: 'tech gadget',
    likes: 340,
    comments: 89,
    shares: 45,
  },
  {
    title: 'Cómo la IA está cambiando el marketing',
    type: 'Texto',
    date: new Date('2024-08-16T09:00:00').toISOString(),
    platform: 'LinkedIn',
    image: 'https://picsum.photos/seed/li1/200/200',
    imageHint: 'business meeting',
    likes: 480,
    comments: 120,
    shares: 78,
  },
    {
    title: 'Receta de pastel de chocolate fácil',
    type: 'Imagen',
    date: new Date('2024-08-17T12:00:00').toISOString(),
    platform: 'Pinterest',
    image: 'https://picsum.photos/seed/pin1/200/200',
    imageHint: 'chocolate cake',
    likes: 620,
    comments: 95,
    shares: 150,
  },
  {
    title: 'Resumen de noticias de la semana',
    type: 'Texto',
    date: new Date('2024-08-18T08:00:00').toISOString(),
    platform: 'Twitter',
    image: 'https://picsum.photos/seed/tw1/200/200',
    imageHint: 'news newspaper',
    likes: 88,
    comments: 15,
    shares: 40,
  },
  {
    title: 'Los mejores destinos para viajar en 2025',
    type: 'Video',
    date: new Date('2024-08-19T20:00:00').toISOString(),
    platform: 'YouTube',
    image: 'https://picsum.photos/seed/yt2/200/200',
    imageHint: 'travel map',
    likes: 1200,
    comments: 350,
    shares: 200,
  },
  {
    title: 'Mi setup de productividad para 2024',
    type: 'Imagen',
    date: new Date('2024-08-20T11:00:00').toISOString(),
    platform: 'Instagram',
    image: 'https://picsum.photos/seed/insta2/200/200',
    imageHint: 'desk setup',
    likes: 230,
    comments: 45,
    shares: 30,
  },
];
