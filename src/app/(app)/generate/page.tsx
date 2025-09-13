'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, PlayCircle, Share2, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AiSuggestions } from '@/components/ai-suggestions';
import { generateContent, GenerateContentOutput } from '@/ai/flows/generate-content-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  topic: z.string().min(5, 'Por favor, introduce un tema de al menos 5 caracteres.'),
  contentType: z.enum(['text', 'image', 'video']),
  details: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function GeneratePage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<GenerateContentOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      contentType: 'text',
      details: '',
    },
  });
  
  const contentType = form.watch('contentType');

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      setError(null);
      setResult(null);

      if (values.contentType !== 'text') {
        setTimeout(() => {
          let data = 'https://picsum.photos/seed/genpost1/600/400';
          if (values.contentType === 'video') {
            data = 'https://picsum.photos/seed/video/600/400';
          }
          setResult({ type: values.contentType, data });
        }, 2000);
        return;
      }
      
      try {
        const res = await generateContent({
          topic: values.topic,
          details: values.details || '',
        });
        setResult({ type: 'text', data: res.generatedText });
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ocurrió un error desconocido.');
      }
    });
  }

  return (
    <div className="container mx-auto px-0">
      <PageHeader
        title="Generación de Contenido"
        description="Crea contenido atractivo y optimizado para tus redes sociales con IA."
      />

      <Tabs defaultValue="generate-new">
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="generate-new">Generar Nuevo</TabsTrigger>
          <TabsTrigger value="ai-suggestions">Sugerencias IA</TabsTrigger>
        </TabsList>
        <TabsContent value="generate-new">
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardHeader>
                    <CardTitle>Parámetros</CardTitle>
                    <CardDescription>
                      Define los detalles del contenido que quieres crear.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="topic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tema o Palabra Clave</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Marketing digital para startups" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Contenido</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                             <FormControl>
                               <SelectTrigger>
                                 <SelectValue placeholder="Selecciona un tipo" />
                               </SelectTrigger>
                             </FormControl>
                            <SelectContent>
                              <SelectItem value="text">Texto</SelectItem>
                              <SelectItem value="image">Imagen</SelectItem>
                              <SelectItem value="video">Video</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="details"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Detalles Adicionales</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tono amigable, enfocado en Gen Z, etc."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isPending} className="w-full">
                      {isPending ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Sparkles />
                      )}
                      Generar Contenido
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Previsualización</CardTitle>
                <CardDescription>
                  Así se verá el contenido generado.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 p-4">
                {isPending && <Loader2 className="h-10 w-10 animate-spin text-primary" />}
                {!isPending && !result && !error &&(
                  <div className="text-center text-muted-foreground">
                    El contenido aparecerá aquí.
                  </div>
                )}
                
                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {result && (
                  <div className="w-full">
                    {result.type === 'text' && (
                      <p className="text-sm whitespace-pre-wrap">{result.data}</p>
                    )}
                    {result.type === 'image' && (
                      <Image
                        src={result.data}
                        alt="Contenido de imagen generado"
                        width={600}
                        height={400}
                        className="rounded-lg object-cover"
                        data-ai-hint="city night"
                      />
                    )}
                    {result.type === 'video' && (
                      <div className="relative">
                        <Image
                          src={result.data}
                          alt="Contenido de video generado"
                          width={600}
                          height={400}
                          className="rounded-lg object-cover"
                          data-ai-hint="abstract video"
                        />
                        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40">
                          <PlayCircle className="h-16 w-16 text-white/80" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              {result && (
                <CardFooter>
                  <Button variant="secondary" className="w-full">
                    <Share2 className="mr-2 h-4 w-4" />
                    Publicar o Programar
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="ai-suggestions">
          <AiSuggestions />
        </TabsContent>
      </Tabs>
    </div>
  );
}
