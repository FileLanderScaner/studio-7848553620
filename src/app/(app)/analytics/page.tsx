import { EngagementCharts } from '@/components/engagement-charts';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MessageSquare, Share2, ThumbsUp } from 'lucide-react';
import { scheduledPosts } from '@/lib/scheduled-posts';

const likes = scheduledPosts.reduce((acc, post) => acc + (post.likes || 0), 0);
const comments = scheduledPosts.reduce((acc, post) => acc + (post.comments || 0), 0);
const shares = scheduledPosts.reduce((acc, post) => acc + (post.shares || 0), 0);


const stats = [
  {
    icon: ThumbsUp,
    label: 'Likes',
    value: likes.toLocaleString(),
    change: '+12.5%',
    changeType: 'positive',
  },
  {
    icon: MessageSquare,
    label: 'Comentarios',
    value: comments.toLocaleString(),
    change: '+8.2%',
    changeType: 'positive',
  },
  {
    icon: Share2,
    label: 'Compartidos',
    value: shares.toLocaleString(),
    change: '-1.5%',
    changeType: 'negative',
  },
];

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto px-0">
      <PageHeader
        title="Análisis de Rendimiento"
        description="Métricas y estadísticas clave de tu contenido."
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p
                className={`text-xs ${
                  stat.changeType === 'positive'
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {stat.change} vs. últimos 30 días
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <EngagementCharts posts={scheduledPosts} />
    </div>
  );
}
