# 🚀 Guía de Instalación y Configuración

## 📋 Requisitos Previos

- Node.js >= 18.x
- MySQL >= 8.x
- npm o yarn
- Cuenta en Mailtrap (para emails)

---

## 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
```

---

## 2️⃣ Configurar Backend

### Instalar Dependencias
```bash
cd back
npm install
```

### Configurar Variables de Entorno

1. Copiar el archivo de ejemplo:
```bash
cp .env-example .env
```

2. Editar `.env` con tus datos:
```env
# Database Configuration
USER=root
PASSWORD=tu_password_mysql
HOST=localhost
PORT=3306
DATABASE=gestock_db
DIALECT=mysql

# JWT Secret (genera uno nuevo)
SECRET=tu_clave_secreta_muy_larga_y_segura

# Email Configuration (Mailtrap)
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=tu_usuario_mailtrap
EMAIL_PASSWORD=tu_password_mailtrap
```

### Generar JWT Secret

Puedes generar una clave segura con:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Crear Base de Datos

```bash
# Entrar a MySQL
mysql -u root -p

# Crear la base de datos
CREATE DATABASE gestock_db;

# Salir
EXIT;
```

### Crear Carpetas Necesarias

Las carpetas se crearán automáticamente al iniciar el servidor, pero puedes crearlas manualmente:
```bash
mkdir -p uploads/profiles/products
```

---

## 3️⃣ Configurar Frontend

### Instalar Dependencias
```bash
cd ../front
npm install
```

### Configurar Variables de Entorno

1. Copiar el archivo de ejemplo:
```bash
cp .env-example .env
```

2. Editar `.env`:
```env
VITE_URL=http://localhost:3000
```

---

## 4️⃣ Configurar Mailtrap

### Obtener Credenciales

1. Ve a [Mailtrap](https://mailtrap.io/)
2. Crea una cuenta gratuita
3. Crea un nuevo inbox
4. Copia las credenciales SMTP:
   - Host: `sandbox.smtp.mailtrap.io`
   - Port: `2525`
   - Username: `tu_usuario`
   - Password: `tu_password`

5. Agrégalas al `.env` del backend

---

## 5️⃣ Iniciar el Proyecto

### Terminal 1 - Backend
```bash
cd back
npm run dev
```

Deberías ver:
```
🚀 Servidor iniciado en http://localhost:3000
📁 Archivos estáticos en http://localhost:3000/uploads
✅ Base de datos sincronizada
✅ Asociaciones de Sequelize configuradas
✅ Sistema de archivos configurado
✅ Servidor de email listo para enviar mensajes (Mailtrap)
```

### Terminal 2 - Frontend
```bash
cd front
npm run dev
```

Deberías ver:
```
VITE v7.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## 6️⃣ Crear Usuario Administrador

El **primer usuario que se registre** será automáticamente **ADMIN**.

1. Ve a `http://localhost:5173/auth/register`
2. Registra tu usuario admin
3. Verifica el código en Mailtrap
4. Inicia sesión

---

## 7️⃣ Probar Funcionalidades

### Como Admin:
- ✅ Crear/editar/eliminar productos
- ✅ Agregar imágenes a productos
- ✅ Ver historial de cambios
- ✅ Acceder a logs

### Como Usuario Normal:
- ✅ Ver productos
- ✅ Agregar al carrito
- ✅ Realizar compras
- ✅ Recibir email de confirmación

---

## 🔧 Comandos Útiles

### Backend
```bash
# Desarrollo con hot reload
npm run dev

# Producción
npm start
```

### Frontend
```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linter
npm run lint
```

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"
```bash
# Verificar que MySQL esté corriendo
sudo systemctl status mysql

# Iniciar MySQL
sudo systemctl start mysql

# Verificar credenciales en .env
```

### Error: "Port 3000 already in use"
```bash
# Cambiar puerto en back/index.mjs
const PORT = process.argv[2] ?? 3001

# O matar el proceso en el puerto 3000
kill -9 $(lsof -t -i:3000)
```

### Error: "Email not sending"
```bash
# Verificar credenciales de Mailtrap en .env
# Verificar que EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD estén correctos

# Probar conexión:
node -e "require('./utils/emailService.mjs').verifyEmailConfig()"
```

### Imágenes no se ven
```bash
# Verificar permisos de carpeta uploads
chmod -R 755 back/uploads

# Verificar que la ruta en .env del front sea correcta
VITE_URL=http://localhost:3000
```

### Error: "Token expired"
```bash
# Los tokens JWT expiran en 7 días
# Cerrar sesión y volver a iniciar sesión
```

---

## 📊 Estructura de Carpetas

```
proyecto/
├── back/
│   ├── config/
│   │   ├── db.mjs
│   │   └── multer.mjs
│   ├── controllers/
│   │   └── logsController.mjs
│   ├── middleware/
│   │   ├── auth.mjs
│   │   └── validation.mjs
│   ├── models/
│   │   ├── User.mjs
│   │   ├── Product.mjs
│   │   └── associations.mjs
│   ├── routes/
│   │   ├── user.mjs
│   │   ├── product.mjs
│   │   └── checkout.mjs ✨ NUEVO
│   ├── utils/
│   │   └── emailService.mjs
│   ├── uploads/
│   │   └── profiles/
│   │       └── products/ ✨ NUEVO
│   ├── .env
│   ├── .env-example
│   ├── index.mjs
│   └── package.json
│
└── front/
    ├── src/
    │   ├── api/
    │   │   └── apiConfig.js
    │   ├── components/
    │   │   ├── ui/
    │   │   │   ├── Button.jsx
    │   │   │   ├── Input.jsx
    │   │   │   ├── Modal.jsx
    │   │   │   └── UserMenu.jsx
    │   │   ├── ProductList.jsx
    │   │   ├── ProductRow.jsx
    │   │   ├── CartItem.jsx
    │   │   └── CartSummary.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── VerificationPage.jsx ✨ NUEVO
    │   │   ├── Profile.jsx
    │   │   ├── CartPage.jsx
    │   │   ├── AddEditProduct.jsx
    │   │   └── Logs.jsx
    │   ├── routes/
    │   │   └── Routes.jsx
    │   ├── store/
    │   │   ├── useStore.js
    │   │   └── useCartStore.js
    │   ├── utils/
    │   │   └── exportLogs.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    ├── .env-example
    └── package.json
```

---

## 🎯 Checklist de Configuración

- [ ] Node.js instalado
- [ ] MySQL instalado y corriendo
- [ ] Base de datos creada
- [ ] Backend: dependencias instaladas
- [ ] Backend: `.env` configurado
- [ ] Frontend: dependencias instaladas
- [ ] Frontend: `.env` configurado
- [ ] Cuenta de Mailtrap creada
- [ ] Credenciales de Mailtrap en `.env`
- [ ] Backend corriendo en puerto 3000
- [ ] Frontend corriendo en puerto 5173
- [ ] Usuario admin creado y verificado
- [ ] Primer producto de prueba creado
- [ ] Email de verificación recibido
- [ ] Compra de prueba realizada
- [ ] Email de confirmación recibido

---

## 🚀 Deploy a Producción

### Preparación
```bash
# Frontend - Build
cd front
npm run build

# Backend - Variables de entorno
# Cambiar .env a valores de producción
```

---

## 📚 Recursos Adicionales

- [Documentación de Sequelize](https://sequelize.org/)
- [Documentación de React Router](https://reactrouter.com/)
- [Documentación de Zustand](https://zustand-demo.pmnd.rs/)
- [Documentación de Mailtrap](https://mailtrap.io/docs/)
- [Documentación de Multer](https://github.com/expressjs/multer)
