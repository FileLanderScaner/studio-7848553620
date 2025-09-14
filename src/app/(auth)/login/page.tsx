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
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, introduce un email válido.' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
});

type FormValues = z.infer<typeof formSchema>;

const GoogleIcon = () => (
    <svg className="size-4" viewBox="0 0 48 48">
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      ></path>
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      ></path>
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      ></path>
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,35.244,44,30.034,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      ></path>
    </svg>
);


export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, signup, loginWithGoogle } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setError(null);
    form.reset();
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
      case 'auth/popup-closed-by-user':
        return 'La ventana de inicio de sesión fue cerrada. Por favor, inténtalo de nuevo.';
      default:
        return 'Ocurrió un error. Por favor, inténtalo de nuevo.';
    }
  };
  
  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'login') {
        await login(values.email, values.password);
        toast({ title: '¡Bienvenido de vuelta!' });
      } else {
        await signup(values.email, values.password);
        toast({ title: '¡Cuenta creada con éxito!', description: 'Bienvenido a Contenido Maestro.' });
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
      toast({ title: '¡Has iniciado sesión con Google!' });
      router.push('/dashboard');
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

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
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>Iniciar Sesión</CardTitle>
                    <CardDescription>Accede a tu cuenta para continuar.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {error && (
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
                  <CardFooter className="flex-col gap-4">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading && <Loader2 className="mr-2 animate-spin" />}
                      Iniciar Sesión
                    </Button>
                    <div className="flex w-full items-center gap-4">
                      <Separator className="flex-1" />
                      <span className="text-xs text-muted-foreground">O</span>
                      <Separator className="flex-1" />
                    </div>
                     <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                    >
                      {loading && <Loader2 className="mr-2 animate-spin" />}
                      <GoogleIcon />
                      <span className="ml-2">Continuar con Google</span>
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
                     {error && (
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
                  <CardFooter className="flex-col gap-4">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading && <Loader2 className="mr-2 animate-spin" />}
                      Crear Cuenta
                    </Button>
                     <div className="flex w-full items-center gap-4">
                      <Separator className="flex-1" />
                      <span className="text-xs text-muted-foreground">O</span>
                      <Separator className="flex-1" />
                    </div>
                     <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                    >
                      {loading && <Loader2 className="mr-2 animate-spin" />}
                       <GoogleIcon />
                      <span className="ml-2">Continuar con Google</span>
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
