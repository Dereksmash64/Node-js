# Plataforma Música (Podcast) (Proyecto 15)

## Requisitos
Node.js >= 16, MongoDB local o Atlas.

## Instalación
1. Clonar
2. `npm install`
3. Copiar `.env.example` a `.env` y ajustar:
   - `MONGO_URI` (ej: mongodb://localhost:27017/plataforma_musica)
   - `JWT_SECRET` = cadena segura
4. Crear carpeta `uploads/` (el servidor también la crea si no existe)
5. `npm run dev`

## Endpoints principales
- `POST /api/auth/register` {name,email,password} -> {token}
- `POST /api/auth/login` {email,password} -> {token}
- `GET /api/songs` -> lista canciones
- `POST /api/songs` (auth + multipart/form-data, campo mp3) {title, artist, mp3}
- `GET /uploads/:filename` -> archivo mp3

## Frontend
Abre `http://localhost:4000` y prueba registro/login, subir canciones y listar.

## Rubrica
- Modelado: `src/models/*`
- API RESTful: `src/routes/*` + controllers
- Frontend: `public/index.html` y `public/app.js`
- Manejo archivos: `src/middlewares/upload.js` (Multer)
- Seguridad: `src/middlewares/auth.js` (JWT) y bcrypt en authController
- Documentación: este README
