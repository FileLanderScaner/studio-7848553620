# Contenido Maestro

"Contenido Maestro" es una potente plataforma de gestión de redes sociales diseñada para creadores de contenido, freelancers y agencias. Su objetivo es simplificar y potenciar todo el ciclo de vida del contenido, desde la ideación hasta el análisis, utilizando el poder de la inteligencia artificial.

## Funcionalidades Clave

- **Generación de Contenido con IA:** Utiliza la inteligencia artificial de Google para crear textos, imágenes y vídeos atractivos a partir de un simple tema o idea.
- **Planificación Estratégica:** Ofrece un "Estratega Semanal" que genera un plan de contenido completo para 7 días, sugiriendo temas y formatos.
- **Calendario de Publicaciones:** Permite programar y visualizar todo el contenido en un calendario interactivo, con sugerencias de horarios óptimos.
- **Análisis de Rendimiento:** Proporciona un dashboard con métricas clave (likes, comentarios, compartidos) y gráficos para analizar la efectividad del contenido.
- **Gestión de Conexiones:** Una interfaz para conectar y gestionar las diferentes cuentas de redes sociales.
- **Modelo de Monetización:** Incluye una sección con planes de suscripción para desbloquear funcionalidades avanzadas.

## Hoja de Ruta del Backend para Producción

Este proyecto es un prototipo funcional avanzado. La interfaz de usuario y la integración con la IA para la generación de contenido están completas. Sin embargo, para convertirlo en una aplicación de producción, las siguientes funcionalidades de backend deben ser desarrolladas:

### 1. Integración Real con Redes Sociales (`/connections`)

-   **Estado Actual:** La página de "Conexiones" es una simulación visual. Los botones no inician un flujo de autenticación real.
-   **Tarea Pendiente:** Implementar el flujo de autenticación **OAuth 2.0** para cada plataforma soportada (Instagram, Facebook, LinkedIn, Twitter/X, TikTok).
    -   Obtener claves de API de desarrollador para cada red social.
    -   Crear Cloud Functions para manejar los callbacks de OAuth y el intercambio de códigos por tokens.
    -   Almacenar de forma segura los tokens de acceso y *refresh tokens* del usuario en una colección dedicada en Firestore, asociándolos a su UID.
    -   Implementar la lógica de encriptación para los tokens almacenados.

### 2. Publicación Automática de Contenido (`/schedule`)

-   **Estado Actual:** Las publicaciones programadas se guardan en Firestore, pero no se publican automáticamente.
-   **Tarea Pendiente:** Crear una **Cloud Function programada (cron job)** utilizando Firebase Cloud Scheduler.
    -   Configurar la función para que se ejecute a intervalos regulares (p. ej., cada 5 minutos).
    -   La función deberá consultar Firestore en busca de publicaciones cuya `date` esté en el pasado y su estado sea "pendiente".
    -   Utilizar los tokens de acceso almacenados para publicar el contenido a través de la API de la red social correspondiente.
    -   Actualizar el estado de la publicación en Firestore a "publicado" o "error" y guardar el ID de la publicación externa si la API lo devuelve.

### 3. Sincronización de Analíticas Reales (`/analytics`)

-   **Estado Actual:** Las métricas de rendimiento (likes, comentarios, etc.) se generan con números aleatorios como marcadores de posición.
-   **Tarea Pendiente:** Crear una **Cloud Function programada** para sincronizar datos.
    -   Configurar la función para que se ejecute periódicamente (p. ej., cada hora).
    -   La función deberá obtener la lista de publicaciones realizadas desde Firestore.
    -   Usar la API de cada red social para solicitar las estadísticas actualizadas de cada publicación (likes, comentarios, compartidos, visualizaciones, clics).
    -   Actualizar los campos de métricas en los documentos de Firestore correspondientes.

### 4. Sistema de Pagos y Suscripciones (`/monetization`)

-   **Estado Actual:** La selección de un plan en la página de "Monetización" es solo visual y no procesa pagos.
-   **Tarea Pendiente:** Integrar un sistema de pagos como **Stripe**.
    -   Configurar los productos (planes Gratis, Pro, Business) en el dashboard de Stripe.
    -   Utilizar la extensión de Firebase para Stripe o crear Cloud Functions que gestionen:
        -   La creación de sesiones de checkout de Stripe.
        -   La gestión de webhooks de Stripe para confirmar pagos, manejar renovaciones, cancelaciones y actualizar el estado de la suscripción del usuario en Firestore.
        -   La lógica para restringir o habilitar funcionalidades basadas en el plan activo del usuario, verificando su estado en Firestore.

### 5. Seguridad y Escalabilidad

-   **Estado Actual:** Las reglas de seguridad y la gestión de secretos son básicas.
-   **Tarea Pendiente:**
    -   Implementar **Reglas de Seguridad de Firestore** detalladas para asegurar que los usuarios solo puedan acceder y modificar sus propios datos.
    -   Almacenar todas las claves de API de terceros (redes sociales, Stripe, etc.) de forma segura utilizando **Firebase Secret Manager**.
    -   Implementar un sistema de registro de errores y logs robusto con **Cloud Logging** para monitorear el comportamiento de las Cloud Functions.
