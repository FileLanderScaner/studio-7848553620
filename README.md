# Contenido Maestro

"Contenido Maestro" es una potente plataforma de gestión de redes sociales diseñada para creadores de contenido, freelancers y agencias. Su objetivo es simplificar y potenciar todo el ciclo de vida del contenido, desde la ideación hasta el análisis, utilizando el poder de la inteligencia artificial.

## Funcionalidades Clave

- **Generación de Contenido con IA:** Utiliza la inteligencia artificial de Google para crear textos, imágenes y vídeos atractivos a partir de un simple tema o idea.
- **Planificación Estratégica:** Ofrece un "Estratega Semanal" que genera un plan de contenido completo para 7 días, sugiriendo temas y formatos.
- **Calendario de Publicaciones:** Permite programar y visualizar todo el contenido en un calendario interactivo, con sugerencias de horarios óptimos.
- **Análisis de Rendimiento:** Proporciona un dashboard con métricas clave (likes, comentarios, compartidos) y gráficos para analizar la efectividad del contenido.
- **Gestión de Conexiones:** Una interfaz para conectar y gestionar las diferentes cuentas de redes sociales.
- **Modelo de Monetización:** Incluye una sección con planes de suscripción para desbloquear funcionalidades avanzadas.

## Estado del Proyecto y Próximos Pasos

Este proyecto es un prototipo funcional avanzado. La interfaz de usuario y la integración con la IA para la generación de contenido están completas. Sin embargo, para convertirlo en una aplicación de producción, las siguientes funcionalidades de backend deben ser desarrolladas:

### 1. Integración Real con Redes Sociales

-   **Estado Actual:** La página de "Conexiones" es una simulación visual. Los botones no inician un flujo de autenticación real.
-   **Tarea Pendiente:** Implementar el flujo de autenticación **OAuth 2.0** para cada plataforma soportada (Instagram, Facebook, etc.).
    -   Obtener claves de API de desarrollador para cada red social.
    -   Crear Cloud Functions para manejar los callbacks de OAuth.
    -   Almacenar de forma segura los tokens de acceso del usuario en Firestore, asociándolos a su UID.

### 2. Publicación Automática de Contenido Programado

-   **Estado Actual:** Las publicaciones programadas se guardan en Firestore, pero no se publican automáticamente.
-   **Tarea Pendiente:** Crear una **Cloud Function programada (cron job)**.
    -   Configurar la función para que se ejecute a intervalos regulares (p. ej., cada 5 o 10 minutos).
    -   La función deberá consultar Firestore en busca de publicaciones cuya `date` sea pasada y que no hayan sido publicadas.
    -   Utilizar los tokens de acceso almacenados para publicar el contenido a través de la API de la red social correspondiente.
    -   Marcar la publicación como "publicada" en Firestore para evitar duplicados.

### 3. Sincronización de Analíticas Reales

-   **Estado Actual:** Las métricas de rendimiento (likes, comentarios, etc.) se generan con números aleatorios como marcadores de posición.
-   **Tarea Pendiente:** Crear una **Cloud Function programada** para sincronizar datos.
    -   Configurar la función para que se ejecute periódicamente (p. ej., cada hora).
    -   La función deberá obtener la lista de publicaciones realizadas desde Firestore.
    -   Usar la API de cada red social para solicitar las estadísticas actualizadas de cada publicación.
    -   Actualizar los campos `likes`, `comments`, y `shares` en los documentos de Firestore correspondientes.

### 4. Sistema de Pagos y Suscripciones

-   **Estado Actual:** La selección de un plan en la página de "Monetización" es solo visual y no procesa pagos.
-   **Tarea Pendiente:** Integrar un sistema de pagos como **Stripe**.
    -   Configurar los planes de suscripción en el dashboard de Stripe.
    -   Utilizar la extensión de Firebase para Stripe o crear Cloud Functions que gestionen:
        -   La creación de sesiones de checkout de Stripe.
        -   La gestión de webhooks de Stripe para confirmar pagos y actualizar el estado de la suscripción del usuario en Firestore.
        -   La lógica para restringir o habilitar funcionalidades basadas en el plan activo del usuario.
