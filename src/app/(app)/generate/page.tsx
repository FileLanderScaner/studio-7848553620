'use client';

import { useState } from 'react';
import Image from 'next/image';
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
import { Loader2, PlayCircle, Share2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AiSuggestions } from '@/components/ai-suggestions';

type ContentType = 'text' | 'image' | 'video';
type GeneratedContent = {
  type: ContentType;
  data: string;
};

export default function GeneratePage() {
  const [contentType, setContentType] = useState<ContentType>('text');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);

  const handleGenerate = () => {
    setIsLoading(true);
    setGeneratedContent(null);
    setTimeout(() => {
      let data = 'Este es un texto de ejemplo generado por la IA sobre el tema solicitado.';
      if (contentType === 'image') {
        data = 'https://picsum.photos/seed/genpost1/600/400';
      } else if (contentType === 'video') {
        data = 'https://picsum.photos/seed/video/600/400';
      }
      setGeneratedContent({ type: contentType, data });
      setIsLoading(false);
    }, 2000);
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
              <CardHeader>
                <CardTitle>Parámetros</CardTitle>
                <CardDescription>
                  Define los detalles del contenido que quieres crear.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Tema o Palabra Clave</Label>
                  <Input id="topic" placeholder="Ej: Marketing digital para startups" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content-type">Tipo de Contenido</Label>
                  <Select onValueChange={(v: ContentType) => setContentType(v)} defaultValue={contentType}>
                    <SelectTrigger id="content-type">
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Texto</SelectItem>
                      <SelectItem value="image">Imagen</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="details">Detalles Adicionales</Label>
                  <Textarea
                    id="details"
                    placeholder="Tono amigable, enfocado en Gen Z, etc."
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
                  {isLoading && <Loader2 className="animate-spin" />}
                  Generar Contenido
                </Button>
              </CardFooter>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Previsualización</CardTitle>
                <CardDescription>
                  Así se verá el contenido generado.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 p-4">
                {isLoading && <Loader2 className="h-10 w-10 animate-spin text-primary" />}
                {!isLoading && !generatedContent && (
                  <div className="text-center text-muted-foreground">
                    El contenido aparecerá aquí.
                  </div>
                )}
                {generatedContent && (
                  <div className="w-full">
                    {generatedContent.type === 'text' && (
                      <p className="text-sm">{generatedContent.data}</p>
                    )}
                    {generatedContent.type === 'image' && (
                      <Image
                        src={generatedContent.data}
                        alt="Contenido de imagen generado"
                        width={600}
                        height={400}
                        className="rounded-lg object-cover"
                        data-ai-hint="city night"
                      />
                    )}
                    {generatedContent.type === 'video' && (
                      <div className="relative">
                        <Image
                          src={generatedContent.data}
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
              {generatedContent && (
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
