# SPORTLY

App web móvil (PWA-ready) para descubrir monitores deportivos en un **feed vertical de vídeos** y reservar un entrenamiento:
**vídeo → perfil → horario → reserva**.

## Tecnología
React 19 · TypeScript · Vite · Tailwind CSS 4 · React Router 7 · Vitest. Sin backend (prototipo local).
Elegida por sencillez y mantenibilidad; la capa `src/services/api.ts` aísla los datos para migrar a Supabase.

## Ejecutar
```bash
npm install
npm run dev       # desarrollo (http://localhost:5173)
npm run build     # compilación de producción
npm test          # tests de reservas y filtros
```

## Qué funciona de verdad (en el navegador)
- Feed 9:16 con scroll-snap, un solo `<video>` activo (±1 precargado), pausa al tocar, sonido manual, estados de carga/error/sin vídeo, flechas ↑↓ de teclado.
- Me gusta, favoritos, compartir (Web Share o copia de enlace) con persistencia en `localStorage`.
- Perfil del monitor: bio, servicios, galería de vídeos, valoraciones, denuncia (se registra sólo en el dispositivo).
- Explorar: búsqueda (sin tildes) y filtros reales de deporte, ubicación, nivel, precio, valoración y disponibilidad.
- Reserva en 4 pasos (servicio → fecha → hora → resumen) + confirmación. Las horas salen de la disponibilidad semanal del monitor,
  descontando reservas existentes (con solape por duración), horas pasadas y 2 h de antelación mínima. Doble pulsación protegida.
- Reservas: próximas / historial / canceladas, detalle y cancelación (gratuita hasta 24 h antes). Estados `pending|confirmed|completed|cancelled`
  (`completed` se deriva al pasar la hora de fin). Al cancelar, el horario vuelve a quedar libre.
- **Perfil de monitor** (Perfil → «Crea tu perfil»): datos, entrenamientos, disponibilidad semanal y vídeos (subida de archivo hasta 60 MB guardada en IndexedDB, o URL https). Se publica en feed, Explorar y reservas junto a los monitores de demostración, marcado como no verificado y sin etiqueta de prueba.
- Onboarding opcional que ordena feed y resultados; perfil editable, notificaciones (sólo preferencia), borrado de datos locales.

## Qué es simulación / datos de demostración
- `src/data/seed.ts`: 8 monitores, servicios, vídeos, **valoraciones y horarios ficticios**, marcados como "datos de prueba". Nadie está "verificado".
- **Vídeos de demostración:** los 16 vídeos de `seed.ts` apuntan a clips de ejemplo públicos de Google (`gtv-videos-bucket`). Son vídeos reales pero **no son de deporte** y no se pudieron comprobar desde el entorno de desarrollo (red restringida). Si un clip no carga, el feed muestra la ilustración de sustitución. Cámbialos por tus mp4 verticales (9:16) editando `src`, o súbelos desde el perfil de monitor.
- Los vídeos que sube un monitor viven en el navegador de ese dispositivo: no los ve nadie más hasta que haya backend + almacenamiento (Supabase Storage).
- **Sin autenticación:** hay un único perfil local ("Invitado"). Todo se guarda en `localStorage` de ese navegador.
- **Reservas locales:** la comprobación anti-duplicados se hace en el cliente (leyendo el almacenamiento justo antes de escribir). **No es segura frente a varios dispositivos**: en producción debe hacerla el servidor.
- **Sin pagos:** no se cobra ni se piden datos de tarjeta. `Booking.paymentRef` queda reservado para una pasarela (p. ej. Stripe Connect, cuyo modelo de comisiones, devoluciones y disputas hay que definir).
- Notificaciones, moderación de denuncias y verificación de monitores: no implementadas.

## Conectar un backend (Supabase)
1. Crear proyecto y ejecutar `supabase/schema.sql` (tablas, índices, RLS, restricción anti-solape y funciones `create_booking` / `cancel_booking`).
2. Copiar `.env.example` a `.env.local` con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (sólo clave pública; la `service_role` nunca en el frontend).
3. Instalar `@supabase/supabase-js`, implementar `SportlyApi` (src/services/api.ts) contra Supabase y activar Auth (registro, login, recuperación).
   Exigir sesión para reservar, favoritos persistentes y reseñas; navegar el feed seguirá siendo público.
4. Completar el TODO de `create_booking` (validar que la hora cae en `availability`) y migrar `seed.ts` a filas con `is_demo = true`.

## Limitaciones conocidas
- Sin zonas horarias (se usa la hora local del dispositivo).
- Disponibilidad como plantilla semanal sin excepciones ni vacaciones.
- Textos legales, RGPD/consentimientos y derechos de imagen de los vídeos pendientes de definir.
- Accesibilidad revisada a nivel básico (roles, etiquetas, foco), sin auditoría completa.

## Publicar en GitHub Pages
`npm run build:pages` genera `docs/` (rutas con `#`, rutas relativas). Se sube con el commit; en el repositorio:
Settings → Pages → Source: *Deploy from a branch* → rama `claude/sportly-monitors-app-pejipk` (o `main` tras fusionar) → carpeta `/docs`.
Vuelve a ejecutar `npm run build:pages` y haz commit cada vez que cambies la app.
