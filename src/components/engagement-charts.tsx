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

const engagementData = [
  { date: '01/08', likes: 28, comments: 5, shares: 3 },
  { date: '02/08', likes: 35, comments: 8, shares: 5 },
  { date: '03/08', likes: 42, comments: 10, shares: 7 },
  { date: '04/08', likes: 30, comments: 7, shares: 4 },
  { date: '05/08', likes: 55, comments: 15, shares: 12 },
  { date: '06/08', likes: 60, comments: 18, shares: 15 },
  { date: '07/08', likes: 48, comments: 12, shares: 9 },
];

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

const totalEngagementData = [
  { name: 'Likes', value: 3000, fill: 'var(--color-likes)' },
  { name: 'Comentarios', value: 800, fill: 'var(--color-comments)' },
  { name: 'Compartidos', value: 450, fill: 'var(--color-shares)' },
];

export function EngagementCharts() {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Interacción en los Últimos 7 Días</CardTitle>
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
