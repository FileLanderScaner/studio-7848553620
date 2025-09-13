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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Clipboard, Download, Image as ImageIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AiSuggestions } from '@/components/ai-suggestions';
import { generateContent, GenerateContentOutput } from '@/ai/flows/generate-content-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

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
      
      try {
        const res = await generateContent({
          topic: values.topic,
          contentType: values.contentType,
          details: values.details || '',
        });
        setResult(res);
      } catch (e: any) {
        if (typeof e.message === 'string' && e.message.includes('429')) {
          setError('Se ha excedido la cuota de la API. Por favor, inténtalo de nuevo más tarde.');
        } else {
          setError(e instanceof Error ? e.message : 'Ocurrió un error desconocido.');
        }
      }
    });
  }

  const handleCopy = () => {
    if (result?.type === 'text' && result.data) {
      navigator.clipboard.writeText(result.data);
      toast({
        title: 'Copiado',
        description: 'El texto ha sido copiado al portapapeles.',
      });
    }
  };

  const handleDownload = () => {
    if ((result?.type === 'image' || result?.type === 'video') && result.data) {
      const link = document.createElement('a');
      link.href = result.data;
      const fileName = result.type === 'image' ? 'imagen-generada.png' : 'video-generado.mp4';
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
       toast({
        title: 'Descargando',
        description: `Tu ${result.type === 'image' ? 'imagen' : 'video'} ha comenzado a descargarse.`,
      });
    }
  };

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
                   <div className="flex flex-col items-center gap-4 text-center text-muted-foreground">
                     <div className="rounded-full border border-dashed p-4">
                       <ImageIcon className="h-12 w-12" />
                     </div>
                     <p>El contenido aparecerá aquí una vez generado.</p>
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
                      <p className="whitespace-pre-wrap font-body text-sm">
                        {result.data}
                      </p>
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
                        <video controls src={result.data} width="600" height="400" className="rounded-lg object-cover" data-ai-hint="abstract video" />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              {result && (
                <CardFooter className="flex-col items-center justify-center gap-2 pt-6 sm:flex-row">
                  {result.type === 'text' && (
                    <Button variant="secondary" onClick={handleCopy}>
                      <Clipboard className="mr-2 h-4 w-4" />
                      Copiar Texto
                    </Button>
                  )}
                  {(result.type === 'image' || result.type === 'video') && (
                    <Button variant="secondary" onClick={handleDownload}>
                      <Download className="mr-2 h-4 w-4" />
                      Descargar
                    </Button>
                  )}
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
