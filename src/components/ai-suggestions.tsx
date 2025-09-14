'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';

import {
  SuggestImprovementsInput,
  SuggestImprovementsOutput,
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const formSchema = z.object({
  contentDraft: z
    .string()
    .min(20, 'Por favor, introduce un borrador de al menos 20 caracteres.'),
});

export function AiSuggestions() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<SuggestImprovementsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contentDraft: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      setError(null);
      setResult(null);
      try {
        const suggestImprovementsFn = httpsCallable<SuggestImprovementsInput, SuggestImprovementsOutput>(functions, 'suggestImprovements');
        const res = await suggestImprovementsFn(values);
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
          <CardTitle>Sugerencias de Contenido con IA</CardTitle>
          <CardDescription>
            Pega tu borrador de contenido a continuación y nuestra IA te
            sugerirá mejoras para aumentar su impacto.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <FormField
                control={form.control}
                name="contentDraft"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Borrador de Contenido</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Escribe o pega aquí tu contenido..."
                        className="min-h-[150px] resize-y"
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
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Sparkles />
                )}
                <span>Obtener Sugerencias</span>
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isPending && (
        <div className="flex items-center justify-center rounded-lg border bg-card p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">Analizando contenido...</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Contenido Mejorado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">
                {result.improvedContent}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Explicación</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {result.explanation}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
