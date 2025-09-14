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
export const initialScheduledPosts: Omit<ScheduledPost, 'id' | 'likes' | 'comments' | 'shares'>[] = [
  {
    title: '5 tips para crecer en Instagram',
    type: 'Imagen',
    date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    platform: 'Instagram',
    image: 'https://picsum.photos/seed/insta1/200/200',
    imageHint: 'social media flatlay',
  },
  {
    title: 'Análisis del nuevo iPhone',
    type: 'Video',
    date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    platform: 'YouTube',
    image: 'https://picsum.photos/seed/yt1/200/200',
    imageHint: 'tech gadget',
  },
  {
    title: 'Cómo la IA está cambiando el marketing',
    type: 'Texto',
    date: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    platform: 'LinkedIn',
    image: 'https://picsum.photos/seed/li1/200/200',
    imageHint: 'business meeting',
  },
    {
    title: 'Receta de pastel de chocolate fácil',
    type: 'Imagen',
    date: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString(),
    platform: 'Pinterest',
    image: 'https://picsum.photos/seed/pin1/200/200',
    imageHint: 'chocolate cake',
  },
  {
    title: 'Resumen de noticias de la semana',
    type: 'Texto',
    date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
    platform: 'Twitter',
    image: 'https://picsum.photos/seed/tw1/200/200',
    imageHint: 'news newspaper',
  },
  {
    title: 'Los mejores destinos para viajar en 2025',
    type: 'Video',
    date: new Date(new Date().setDate(new Date().getDate() + 6)).toISOString(),
    platform: 'YouTube',
    image: 'https://picsum.photos/seed/yt2/200/200',
    imageHint: 'travel map',
  },
  {
    title: 'Mi setup de productividad para 2024',
    type: 'Imagen',
    date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    platform: 'Instagram',
    image: 'https://picsum.photos/seed/insta2/200/200',
    imageHint: 'desk setup',
  },
];
