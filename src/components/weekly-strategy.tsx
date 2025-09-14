'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getFunctions, httpsCallable } from 'firebase/functions';

import {
  GenerateWeeklyStrategyInput,
  GenerateWeeklyStrategyOutput,
} from '@/lib/genkit-types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from './ui/badge';

const formSchema = z.object({
  topic: z.string().min(3, 'Por favor, introduce un tema de al menos 3 caracteres.'),
});

export function WeeklyStrategy() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<GenerateWeeklyStrategyOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      setError(null);
      setResult(null);
      try {
        const functions = getFunctions();
        const generateWeeklyStrategyFn = httpsCallable<GenerateWeeklyStrategyInput, GenerateWeeklyStrategyOutput>(functions, 'generateWeeklyStrategy');
        const res = await generateWeeklyStrategyFn(values);
        setResult(res.data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ocurrió un error desconocido.');
      }
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Estratega de Contenido Semanal</CardTitle>
          <CardDescription>
            Introduce un tema y la IA generará un plan de contenido para toda la semana, con ideas y formatos para cada día.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tema General</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Fitness en casa, Inversión para principiantes..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : <Sparkles />}
                <span>Generar Estrategia Semanal</span>
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isPending && (
        <div className="flex items-center justify-center rounded-lg border bg-card p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">Generando estrategia...</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && result.strategy && (
        <Card>
          <CardHeader>
            <CardTitle>Tu Plan de Contenido Semanal</CardTitle>
            <CardDescription>
              Aquí tienes una sugerencia de publicaciones para la semana sobre "{form.getValues('topic')}".
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Día</TableHead>
                  <TableHead>Idea de Contenido</TableHead>
                  <TableHead className="w-[120px] text-right">Formato</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.strategy.map((dayPlan) => (
                  <TableRow key={dayPlan.day}>
                    <TableCell className="font-medium">{dayPlan.day}</TableCell>
                    <TableCell>{dayPlan.idea}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">{dayPlan.format}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
