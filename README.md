# Swap Closet

Swap Closet es una aplicación web para gestionar el intercambio de prendas entre usuarios.

El proyecto permite publicar prendas, consultar prendas disponibles y gestionar solicitudes de intercambio entre usuarios registrados.

## Índice

- [Descripción](#descripción)
- [Funcionalidades principales](#funcionalidades-principales)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Modelo funcional](#modelo-funcional)
- [Estados de intercambio](#estados-de-intercambio)
- [Configuración](#configuración)
- [Ejecución del proyecto](#ejecución-del-proyecto)
- [Endpoints principales](#endpoints-principales)
- [Capturas](#capturas)
- [Posibles mejoras](#posibles-mejoras)

## Descripción

Swap Closet es una aplicación orientada al intercambio de ropa entre usuarios.

Cada usuario puede publicar prendas propias y consultar prendas publicadas por otros usuarios. A partir de esas prendas, se pueden crear solicitudes de intercambio y gestionar su estado durante el proceso.

La aplicación está organizada siguiendo una estructura por capas, separando la parte de controladores, servicios, acceso a datos, entidades, DTOs, seguridad y gestión de errores.

## Funcionalidades principales

- Registro de usuarios.
- Inicio de sesión.
- Gestión de usuarios.
- Publicación de prendas.
- Consulta de prendas disponibles.
- Consulta del detalle de una prenda.
- Edición y eliminación de prendas.
- Creación de solicitudes de intercambio.
- Gestión de solicitudes recibidas y enviadas.
- Cambio de estado de los intercambios.
- Validaciones sobre usuarios, prendas e intercambios.
- Control de acceso a determinadas operaciones.

## Tecnologías utilizadas

**Backend**
- Java 21
- Spring Boot 3
- Spring Data JPA
- spring-security-crypto (BCrypt para contraseñas)
- PostgreSQL
- Maven
- Cloudinary (almacenamiento de imágenes)
- Docker / Docker Compose

**Frontend**
- Angular 20
- Ionic 8
- Capacitor 7 (despliegue Android)

## Estructura del proyecto

El proyecto sigue una estructura por capas:

```text
controller  -> recibe las peticiones HTTP
service     -> contiene la lógica de negocio
repository  -> acceso a base de datos
entity      -> entidades JPA
dto         -> objetos de entrada y salida de datos
security    -> configuración de autenticación y permisos
exception   -> gestión de errores
```

Ejemplo de estructura general:

```text
src
└── main
    ├── java
    │   └── ...
    │       ├── controller
    │       ├── service
    │       ├── repository
    │       ├── entity
    │       ├── dto
    │       ├── security
    │       └── exception
    └── resources
        └── application.properties
```

## Modelo funcional

El funcionamiento básico de la aplicación es el siguiente:

1. Un usuario se registra o inicia sesión.
2. El usuario publica una prenda.
3. Otros usuarios pueden consultar las prendas disponibles.
4. Un usuario puede solicitar un intercambio.
5. La solicitud queda registrada con un estado inicial.
6. El usuario propietario de la prenda puede aceptar o rechazar la solicitud.
7. El intercambio cambia de estado según la acción realizada.

## Estados de intercambio

Los intercambios pueden tener distintos estados según el momento del proceso:

```text
PENDIENTE
ACEPTADO
RECHAZADO
CANCELADO
COMPLETADO
```

Descripción básica de los estados:

| Estado | Descripción |
|---|---|
| PENDIENTE | La solicitud de intercambio ha sido creada y está esperando respuesta. |
| ACEPTADO | La solicitud ha sido aceptada por el usuario correspondiente. |
| RECHAZADO | La solicitud ha sido rechazada. |
| CANCELADO | La solicitud ha sido cancelada. |
| COMPLETADO | El intercambio se ha finalizado. |

## Ejemplo de uso

Ejemplo de flujo básico dentro de la aplicación:

```text
Usuario A publica una chaqueta.
Usuario B consulta las prendas disponibles.
Usuario B solicita un intercambio por la chaqueta.
Usuario A revisa la solicitud recibida.
Usuario A acepta o rechaza el intercambio.
El estado del intercambio se actualiza.
```

## Configuración

La aplicación utiliza PostgreSQL. Las credenciales se gestionan mediante variables de entorno para no exponer datos sensibles en el repositorio.

La configuración principal se encuentra en:

```text
src/main/resources/application.properties
```

Las variables que debes definir en tu entorno (o en un archivo `.env` local):

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/swap_closet
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=tu_password

CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

En desarrollo local, si no defines las variables, la aplicación usa los valores por defecto definidos en `application.properties`.

## Ejecución del proyecto

Para clonar el repositorio:

```bash
git clone https://github.com/l-rivas-v95/SwapCloset.git
```

Entrar en la carpeta del proyecto:

```bash
cd SwapCloset
```

Compilar el proyecto:

```bash
mvn clean install
```

Ejecutar la aplicación:

```bash
mvn spring-boot:run
```

La aplicación quedará disponible normalmente en:

```text
http://localhost:8080
```

## Endpoints principales

Todos los endpoints tienen el prefijo `/api`.

```text
# Usuarios
POST   /api/usuarios              → registro
POST   /api/usuarios/login        → login
GET    /api/usuarios/{id}
PUT    /api/usuarios/{id}
DELETE /api/usuarios/{id}
GET    /api/usuarios/estadisticas/{id}
POST   /api/usuarios/{id}/foto-perfil

# Productos
GET    /api/productos
POST   /api/productos
GET    /api/productos/{id}
PUT    /api/productos/{id}
DELETE /api/productos/{id}
GET    /api/productos/cartas-activos
GET    /api/productos/filtrar?categoria=&talla=&estado=

# Chats / Intercambios
GET    /api/chats
POST   /api/chats
GET    /api/chats/{id}

# Favoritos, Seguidores, Ratings, Mensajes
GET    /api/favoritos/usuario/{id}
POST   /api/favoritos
GET    /api/seguidores/seguidos/{id}
POST   /api/raitings
GET    /api/mensajes/chat/{id}
```

## Ejemplo de petición

Ejemplo de creación de una prenda:

```json
{
  "nombre": "Chaqueta vaquera",
  "descripcion": "Chaqueta vaquera azul en buen estado",
  "talla": "M",
  "categoria": "Chaquetas",
  "estado": "DISPONIBLE"
}
```

Ejemplo de respuesta:

```json
{
  "id": 1,
  "nombre": "Chaqueta vaquera",
  "descripcion": "Chaqueta vaquera azul en buen estado",
  "talla": "M",
  "categoria": "Chaquetas",
  "estado": "DISPONIBLE"
}
```

## Capturas

Pendiente de añadir capturas de la aplicación.

Capturas recomendadas:

```text
- Pantalla de inicio de sesión
- Pantalla de registro
- Listado de prendas
- Detalle de una prenda
- Formulario de publicación de prenda
- Solicitudes de intercambio
- Gestión de solicitudes recibidas
```

## Posibles mejoras

- Añadir filtros de búsqueda por talla, categoría, estado o usuario.
- Añadir paginación en los listados.
- Mejorar la gestión visual de los estados de intercambio.
- Añadir subida de imágenes para las prendas.
- Documentar la API con Swagger/OpenAPI.
- Añadir tests unitarios.
- Añadir tests de integración.
- Mejorar la gestión global de errores.
- Añadir validaciones más específicas para las operaciones de intercambio.
