'use client';

import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip as ChartTooltipWrapper,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { ScheduledPost } from '@/lib/scheduled-posts';
import { format } from 'date-fns';

type EngagementChartsProps = {
  posts: ScheduledPost[];
};

const chartConfig: ChartConfig = {
  likes: {
    label: 'Likes',
    color: 'hsl(var(--chart-1))',
  },
  comments: {
    label: 'Comentarios',
    color: 'hsl(var(--chart-2))',
  },
  shares: {
    label: 'Compartidos',
    color: 'hsl(var(--chart-3))',
  },
};

export function EngagementCharts({ posts }: EngagementChartsProps) {
    const engagementData = posts.sort((a,b) => a.date.getTime() - b.date.getTime()).map((post) => ({
      date: format(post.date, 'dd/MM'),
      likes: post.likes || 0,
      comments: post.comments || 0,
      shares: post.shares || 0,
    })).slice(-7); // Get last 7 posts for the daily trend

    const engagementByPostData = posts.map(post => ({
        name: post.title.substring(0, 15) + (post.title.length > 15 ? '...' : ''),
        likes: post.likes || 0,
        comments: post.comments || 0,
        shares: post.shares || 0,
    })).slice(-5);


  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Tendencia de Interacción</CardTitle>
          <CardDescription>
            Interacción en las últimas 7 publicaciones.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart accessibilityLayer data={engagementData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltipWrapper content={<ChartTooltipContent indicator="dot" />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line type="monotone" dataKey="likes" stroke="var(--color-likes)" strokeWidth={2} dot={{ fill: 'var(--color-likes)', r: 4 }} />
              <Line type="monotone" dataKey="comments" stroke="var(--color-comments)" strokeWidth={2} dot={{ fill: 'var(--color-comments)', r: 4 }} />
              <Line type="monotone" dataKey="shares" stroke="var(--color-shares)" strokeWidth={2} dot={{ fill: 'var(--color-shares)', r: 4 }} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Desglose por Publicación</CardTitle>
          <CardDescription>
            Interacción en las últimas 5 publicaciones.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart accessibilityLayer data={engagementByPostData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis />
              <ChartTooltipWrapper content={<ChartTooltipContent indicator="dot" />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="likes" fill="var(--color-likes)" radius={4} />
              <Bar dataKey="comments" fill="var(--color-comments)" radius={4} />
              <Bar dataKey="shares" fill="var(--color-shares)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
