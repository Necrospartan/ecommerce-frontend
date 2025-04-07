# ecommerce-frontend

SPA frontend for the digital media adspace reservation platform. Developed with Vue 3, Vite, and Tailwind CSS.

Este es el frontend de la plataforma de e-commerce para la reserva de espacios publicitarios digitales, desarrollado con Vue.js, Vite y Tailwind CSS.

## Requisitos

Asegúrate de tener instalado lo siguiente:

1. Node.js >= 16.x
2. npm (o yarn)

## Clonar el repositorio

```bash
git clone git@github.com:Necrospartan/ecommerce-frontend.git
cd ecommerce-frontend
```

## Instalar dependencias

```bash
npm install
```

## Configurar variables de entorno

```bash
cp .env.example .env
```

En el archivo `.env` debes agregar las siguientes variables:

```dotenv
VITE_BACKEND_URL=<URL del backend>
```

**Explicación de las variables:**

- `VITE_BACKEND_URL`: Indica a la aplicación Vue la URL del backend para realizar las solicitudes API. Asegúrate de reemplazar <URL del backend> con la dirección correspondiente (por ejemplo, `http://localhost:8000` si estás usando el servidor local).

Una vez configuradas las variables, guarda los cambios.

## Correr el servidor de desarrollo

```bash
npm run dev
```

Esto levantará el servidor de desarrollo en http://localhost:5173 (por defecto).

### Usuarios por defecto para utilizar la aplicación:

- `Administrador@example.org`, usuario con el rol Adimistrador, que puede registrar Medios.

- `Cliente1@example.org`, usuario con el rol de Cliente, que puede registrar hacer reservaciones.

- `Cliente2@example.org`, usuario con el rol de Cliente, que puede registrar hacer reservaciones.

La contraseña por defecto para los 3 usuarios es: **Password#1**

Ya existe `Medios` y `Reservaciones` creadas asociados a los dos usuariso anteriores.
