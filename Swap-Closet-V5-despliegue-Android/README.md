# SwapCloset

Aplicación móvil para intercambiar ropa entre usuarios. Puedes publicar prendas que ya no usas, explorar las de otros, contactar por chat y cerrar un intercambio directamente desde la app.

---

## Stack tecnológico

**Backend**
- Java 21 + Spring Boot 3.5
- PostgreSQL
- JPA / Hibernate + MapStruct
- BCrypt (spring-security-crypto)
- Cloudinary (almacenamiento de imágenes)
- Docker

**Frontend**
- Angular 20 + Ionic 8
- Capacitor 7 (compilación Android)
- Angular Signals
- TypeScript

---

## Funcionalidades principales

- Registro y login con contraseña hasheada (BCrypt)
- Publicar prendas con imágenes subidas a Cloudinary
- Explorar prendas con buscador (título, marca, categoría, color…)
- Sistema de favoritos
- Chat entre usuarios con sistema de intercambio:
  - Propuesta de prenda, fecha y lugar de entrega
  - Confirmación doble para completar el intercambio
  - Las prendas intercambiadas pasan a "publicaciones pasadas" automáticamente
- Valoraciones (rating) tras completar un intercambio
- Sistema de seguidores / siguiendo con buscador
- Notificaciones de mensajes nuevos en el menú y en la lista de chats
- Filtros de chats: Todos / Activos / Completados

---

## Estructura del proyecto

```
SwapCloset/
├── backend/          # API REST Spring Boot
│   ├── src/
│   │   ├── main/java/org/swapcloset/backend/
│   │   │   ├── controller/   # 8 controladores REST
│   │   │   ├── service/      # Lógica de negocio
│   │   │   ├── repository/   # Spring Data JPA
│   │   │   ├── modelos/      # Entidades JPA
│   │   │   ├── dto/          # DTOs de respuesta
│   │   │   ├── converter/    # Mappers MapStruct
│   │   │   ├── config/       # CORS, Cloudinary
│   │   │   └── exception/    # Manejo de errores
│   │   └── test/             # Tests unitarios y con Mockito
│   └── Dockerfile
├── frontend/         # App Angular + Ionic
│   ├── src/app/
│   │   ├── pages/    # 15 páginas
│   │   ├── components/
│   │   ├── service/
│   │   └── modelos/
│   └── Dockerfile
└── db/
    ├── schema.sql    # Estructura de la base de datos
    └── seed.sql      # Datos de prueba (5 usuarios)
```

---

## Tests

El backend incluye tests unitarios y tests de integración con Mockito para los servicios principales:

- `ChatServiceTest` / `ChatServiceMockito`
- `ProductoServiceTest` / `ProductoServiceMockito`
- `UsuarioServiceTest` / `UsuarioServiceMockito`
- `RaitingServiceTest` / `RaitingServiceMockito`

---

## Configuración

### Variables de entorno (backend)

Crea un archivo `.env` o configura las siguientes variables en tu entorno:

```
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/swap_closet
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=tu_password

CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### Arrancar el backend

```bash
cd backend
./mvnw spring-boot:run
```

### Arrancar el frontend

```bash
cd frontend
npm install
ionic serve
```

### Cargar datos de prueba

```bash
psql -U postgres -d swap_closet -f db/schema.sql
psql -U postgres -d swap_closet -f db/seed.sql
```

Los 5 usuarios de prueba usan la contraseña: `swap123`

---

## Compilación Android

```bash
cd frontend
ionic build
npx cap sync android
npx cap open android
```
