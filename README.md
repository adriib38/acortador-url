# Acortador de URLs

Este proyecto es una aplicación para acortar URLs, diseñada para facilitar la gestión y el seguimiento de enlaces. La aplicación incluye funcionalidades de autenticación de usuarios, generación de URLs cortas y redirección a URLs originales.

## Características principales

- **Autenticación de usuarios:**
  - Registro y login de usuarios.
  - Protección de rutas mediante autenticación con JWT.
- **Gestión de URLs:**
  - Asociación de URLs cortas con usuarios registrados.
  - Redirección a URLs originales a través de rutas dinámicas.
- **Middleware de validación:**
  - Validación de URLs antes de acortarlas.

## Estructura del proyecto

```
src/
├── app.js               # Configuración principal del servidor Express
├── index.js             # Levantar servidor Express
├── controllers/         # Controladores para manejar la lógica de las rutas
├── Models/              # Definición de modelos y relaciones de orm Sequelize
├── services/            # Servicios como la conexión a la base de datos
├── utils/               # Utilidades como validación de URLs

config/
├──config.js     # DB config por entorno

```

## Configuración

1. Clona el repositorio:
   ```bash
   git clone https://github.com/adriib38/acortador-url.git
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Definir configuración de base de datos en archivo `config\config.json`, revisar `config\config.example.json`

4. Definir variables de entorno `.env`, revisar `.env.example`

5. Una vez creada la bd con el nombre definido en config.json, sincronizar la base de datos para crear tablas y relaciones:
   ```bash
   node src/services/sync.js
   ```

6. Inicia la aplicación:
   ```bash
   npm start
   ```

## Uso

- **Acortar una URL:** Envía una solicitud `POST` a `/c` con el cuerpo:
  ```json
  {
    "url": "https://www.ejemplo.com"
  }
  ```

- **Redirigir a una URL original:** Accede a `/shortcode`, donde `shortcode` es el código generado para la URL corta.

## Tecnologías utilizadas

- **Node.js**
- **Express.js**
- **Sequelize** (ORM para bases de datos SQL)
- **JWT** (JSON Web Tokens para autenticación)

## Contribuciones

¡Las contribuciones son bienvenidas! Por favor, abre un issue o un pull request para sugerir mejoras o reportar problemas.

## Licencia

Este proyecto está bajo la licencia MIT.