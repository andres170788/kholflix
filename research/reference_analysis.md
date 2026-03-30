# Investigacion - Plataforma de Streaming AI (Referencia: Streamit)

## Fecha: 2026-03-01
## Proyecto: Plataforma tipo Netflix para peliculas y series generadas con IA

---

## 1. PRODUCTO DE REFERENCIA

**Nombre:** Streamit - OTT Video & Live Streaming
**Autor:** iqonicdesign (Power Elite Author en Envato)
**Rating:** 4.91/5 (23 reviews) | 427 ventas
**Precio referencia:** $89 USD (Regular License)
**Tags:** flutter, live streaming, movies, netflix, ott platform, trailers, tv series, video streaming
**Ultima actualizacion:** 20 Noviembre 2025

### Ecosistema completo Streamit:
- WordPress Theme (frontend principal)
- ReactJS / VueJS / HTML Admin Template
- Laravel Backend
- Flutter App (iOS + Android)
- WordPress Plugin (streaming)

---

## 2. PANTALLAS Y FLUJO UI (Analisis de 15 Screenshots)

### 2.1 Landing/Splash
- Fondo con grid de posters de peliculas (efecto collage)
- Texto "Watch On Any Devices"
- Tema OSCURO predominante

### 2.2 Login/Register
- Fondo: collage de posters de peliculas con overlay oscuro
- Logo centrado arriba
- "Welcome Back! You have been missed for long time"
- Campos: Email/Username, Password
- Botones: Login, Register, Forgot Password
- Opciones social login

### 2.3 Home/Dashboard Principal
- **Navbar superior:** Logo | Home | Movies | TV Shows | Videos | Search icon | Profile icon
- **Hero section:** Trailer embebido (YouTube) con titulo de pelicula destacada
- **Secciones horizontales scrolleables:**
  - "Specials & Latest Movies" (carousel horizontal)
  - "Continue Watching" (con progress bar)
  - "Trending"
  - "Popular"
  - Cada seccion con flecha ">" para ver mas

### 2.4 Detalle de Pelicula/Serie
- Trailer embebido (YouTube/Vimeo) en la parte superior
- Tags de genero (Action, Adventure, Sci-Fi) como chips
- Titulo grande
- Rating con estrellas (ej: 3.4/5)
- Duracion + Fecha de estreno
- Boton prominente "STREAM NOW" (rojo)
- Boton compartir
- Sinopsis/descripcion
- Seccion "More Like This" (recomendaciones)
- Seccion "Cast" con avatares circulares

### 2.5 Busqueda (Search)
- Barra de busqueda con icono y boton limpiar (X)
- Resultados en lista vertical (thumbnail + titulo + duracion)
- Busqueda en tiempo real (autocomplete)

### 2.6 Generos/Categorias
- Tabs superiores: Movies | TV Shows | Videos
- Grid 2 columnas con imagen de fondo + texto overlay
- Generos: Action, Adventure, Animation, Comedy, Crime, Drama, Horror, Mystery, etc.

### 2.7 Vista por Genero
- Titulo del genero (ej: "ACTION")
- Grid 3 columnas de posters
- Scroll infinito o paginacion

### 2.8 Watchlist
- Grid 3 columnas de posters guardados
- Opcion de eliminar items

### 2.9 Favoritos (My Favourite)
- Lista vertical con thumbnail + titulo + duracion
- Boton eliminar (trash icon rojo)

### 2.10 Playlists
- Tabs: Movies | TV Shows | Videos
- Boton "Create Playlist" arriba
- Lista de playlists creadas (icono + nombre + menu 3 puntos)

### 2.11 Perfil de Usuario
- Avatar circular editable
- Nombre + Email
- Plan actual (FREE) con boton "Upgrade plan"
- "Continue Watching" con progress bar
- Menu: Playlists, Manage Devices, Settings, Logout

### 2.12 Planes de Membresia
- Cards apiladas verticalmente
- Plan Free (verde "Your Plan")
- Plan Basic ($19/month)
- Plan Premium ($39/3 months, bordeado rojo, seleccionado)
- Radio buttons para seleccion

### 2.13 Configuracion (Settings)
- Lista de opciones con iconos:
  - Change Password
  - Language
  - Privacy Policy
  - Terms & Conditions
  - Rate Us
  - Share App
  - About Us
  - Delete Account

### 2.14 Detalle de Actor/Cast
- Foto grande del actor
- Nombre
- Descripcion/Biografia con "view more"
- Personal Info (grid 2x2):
  - Known for (Producer/Actor/Director)
  - Known Credits (numero)
  - Place of Birth
  - Also Known As
- Tabs: All | Movies | TV Shows
- Lista de filmografia

---

## 3. FEATURES CLAVE DEL PRODUCTO

### Funcionalidades de Usuario:
- Search (peliculas, series, videos)
- Autoplay Trailer
- Episode Viewer rapido
- Dashboard dinamico
- Continue Watching (con progress bar)
- Manage Devices (multi-dispositivo)
- PMP Integration (Paid Membership Pro)
- Live Streaming con HLS
- EPG (Electronic Program Guide)
- Video Ads avanzados
- Picture-in-Picture
- Rate and Review
- Download Videos
- Genre Section
- Cast Section
- Embedded Video / YouTube / Vimeo
- Recommended Movies
- Upcoming Movies
- TV Shows con Episodes
- Multi-Language + RTL
- Banner Slider
- Watchlist
- Like Functionality

### Admin Panel:
- Plugin MAS Videos integrado
- Banner images personalizables
- Sliders configurables
- Filtros por genero y tags
- Gestion de contenido completa

---

## 4. PATRONES DE DISENO IDENTIFICADOS

### Paleta de Colores (Original):
- **Fondo principal:** Negro/Gris muy oscuro (#0F0F0F - #1A1A2E)
- **Acento primario:** Rojo (#E50914 - estilo Netflix)
- **Texto primario:** Blanco
- **Texto secundario:** Gris claro
- **Cards/Containers:** Gris oscuro semi-transparente

### Tipografia:
- Sans-serif moderna
- Titulos bold, grande
- Subtitulos medium
- Cuerpo regular, gris claro

### Layout Patterns:
- **Carousels horizontales** para listas de contenido
- **Grids 2-3 columnas** para categorias y busqueda
- **Cards con poster** como unidad base de contenido
- **Hero section** con trailer/banner destacado
- **Bottom navigation** (mobile) / **Top navbar** (web)
- **Tabs** para filtrar contenido (Movies/TV Shows/Videos)
- **Progress bars** para "Continue Watching"
- **Chips/Tags** para generos

### Interacciones:
- Scroll horizontal en carousels
- Infinite scroll en grids
- Pull-to-refresh
- Swipe para navegar
- Modal para detalles rapidos
- Transiciones suaves entre pantallas

---

## 5. ADAPTACION PARA NUESTRO PROYECTO

### Diferencias clave con Streamit:
1. **Contenido:** Peliculas/series hechas con IA (no contenido tradicional)
2. **Paleta:** Morado como base (no rojo Netflix)
3. **Stack:** ReactJS + Tailwind + NodeJS + MySQL (no WordPress/Flutter)
4. **Enfoque web:** Desktop-first con responsive (no mobile-first)
5. **Sin dependencia WordPress:** Backend propio con NodeJS + Express
6. **Video hosting:** Propio o servicio de terceros (no YouTube embeds)

### Elementos a mantener del modelo:
- Estructura de navegacion (Home, Movies, TV Shows, Search, Profile)
- Hero section con contenido destacado
- Carousels horizontales para categorias
- Sistema de generos con grid visual
- Detalle de contenido con trailer + info + cast
- Watchlist y Favoritos
- Sistema de planes/membresia
- Continue Watching con progress tracking
- Search con resultados en tiempo real
- Perfil de usuario con gestion de cuenta

### Elementos unicos para IA:
- Seccion "Behind the Scenes" (como se genero con IA)
- Badge/tag "AI Generated" en contenido
- Info del modelo de IA usado (Sora, Runway, etc.)
- Prompt/concepto original del creador
- Seccion "Making Of" con proceso de generacion
- Comparativas de versiones/tomas generadas
- Comunidad/comentarios sobre las producciones

---

## 6. FUENTES

- CodeCanyon: https://codecanyon.net/item/streamit-flutter-video-streaming-ui-kit/28533546
- Demo web: https://streamit.iqonic.design/
- ReactJS Template: https://themeforest.net/item/streamit-video-streaming-html-admin-template/28369705
- WordPress Theme: https://themeforest.net/item/streamit-video-streaming-wordpress-theme/29772881
