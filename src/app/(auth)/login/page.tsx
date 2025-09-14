'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, introduce un email válido.' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, signup } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setError(null);
    form.clearErrors();
    form.reset();
  };

  const handleLogin = async (values: FormValues) => {
    setLoading(true);
    setError(null);
    try {
      await login(values.email, values.password);
      toast({ title: '¡Bienvenido de vuelta!' });
      router.push('/dashboard');
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (values: FormValues) => {
    setLoading(true);
    setError(null);
    try {
      await signup(values.email, values.password);
      toast({ title: '¡Cuenta creada con éxito!', description: 'Bienvenido a Contenido Maestro.' });
      router.push('/dashboard');
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const getFirebaseErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Email o contraseña incorrectos.';
      case 'auth/email-already-in-use':
        return 'Este email ya está registrado.';
      case 'auth/weak-password':
        return 'La contraseña es demasiado débil (debe tener al menos 6 caracteres).';
       case 'auth/invalid-email':
        return 'El formato del email no es válido.';
      default:
        return 'Ocurrió un error. Por favor, inténtalo de nuevo.';
    }
  };

  const currentFormAction = activeTab === 'login' ? handleLogin : handleSignup;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
            <BrainCircuit className="mb-4 size-12 text-primary" />
            <h1 className="text-3xl font-bold">Contenido Maestro</h1>
            <p className="text-muted-foreground">Tu centro de control para la creación de contenido</p>
        </div>
        <Tabs defaultValue="login" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="signup">Crear Cuenta</TabsTrigger>
          </TabsList>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(currentFormAction)}>
              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>Iniciar Sesión</CardTitle>
                    <CardDescription>Accede a tu cuenta para continuar.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {error && activeTab === 'login' && (
                      <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="tu@email.com" {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contraseña</FormLabel>
                          <FormControl>
                            <Input placeholder="••••••••" {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading && <Loader2 className="mr-2 animate-spin" />}
                      Iniciar Sesión
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="signup">
                <Card>
                  <CardHeader>
                    <CardTitle>Crear Cuenta</CardTitle>
                    <CardDescription>
                      Empieza a generar contenido increíble hoy mismo.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     {error && activeTab === 'signup' && (
                      <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="tu@email.com" {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contraseña</FormLabel>
                          <FormControl>
                            <Input placeholder="••••••••" {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading && <Loader2 className="mr-2 animate-spin" />}
                      Crear Cuenta
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </form>
          </Form>
        </Tabs>
      </div>
    </div>
  );
}
