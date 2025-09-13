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

    const totalLikes = posts.reduce((acc, post) => acc + (post.likes || 0), 0);
    const totalComments = posts.reduce((acc, post) => acc + (post.comments || 0), 0);
    const totalShares = posts.reduce((acc, post) => acc + (post.shares || 0), 0);

    const totalEngagementData = [
      { name: 'Likes', value: totalLikes, fill: 'var(--color-likes)' },
      { name: 'Comentarios', value: totalComments, fill: 'var(--color-comments)' },
      { name: 'Compartidos', value: totalShares, fill: 'var(--color-shares)' },
    ];


  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Interacción en las Últimas Publicaciones</CardTitle>
          <CardDescription>
            Un vistazo a cómo ha evolucionado la interacción.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart data={engagementData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltipWrapper content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line type="monotone" dataKey="likes" stroke="var(--color-likes)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="comments" stroke="var(--color-comments)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="shares" stroke="var(--color-shares)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Desglose de Interacción Total</CardTitle>
          <CardDescription>
            Distribución total de las interacciones.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={totalEngagementData} layout="vertical" margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={80}
              />
              <ChartTooltipWrapper cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <Bar dataKey="value" radius={5} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
