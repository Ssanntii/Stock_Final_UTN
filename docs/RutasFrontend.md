# Documentación de Rutas Frontend (Productos, Usuarios y Logs)

## 🧭 Rutas del Frontend

> [!NOTE]
> Este archivo organiza las rutas del frontend y define los puntos de acceso principales de la aplicación, separando rutas públicas, privadas y de error.
>El archivo `AppRoutes.jsx` define todas las rutas principales de la aplicación, tanto públicas como protegidas, utilizando **React Router**.

---

### 🔹 Rutas Públicas

|Ruta|Componente|Descripción|
|:------|:------------|:-------------:|
|`/`|`Home`|Página principal que muestra la lista de productos disponibles|
|`/auth`|`Public`|Contenedor de las rutas relacionadas con autenticación del usuario|
|`/auth`|`Login`|Página de inicio de sesión para usuarios registrados|
|`/auth/register`|`Register`|Página para crear una nueva cuenta de usuario|

---

### 🔒 Rutas Protegidas

Estas rutas requieren que el usuario esté autenticado (debe existir cuenta y estar iniciada).  
El acceso está controlado mediante el componente `ProtectedRoute`.

|Ruta|Componente|Descripción|
|:---|:---|:---:|
|`/product` |`ProductForm`|Formulario para **agregar** un nuevo producto|
|`/product/:id`|`ProductForm`|Formulario para **editar** un producto existente (se lo busca usando `id`)|
|`/logs`|`Logs`|Página que los cambios recibidos en la base de datos (como creación/edicion de productos), accesible solo para usuarios autorizados|
|`/profile`|`Profile`|Página accesible para los usuarios que ofrece información sobre su perfil y permite cambiar `nombre`, `contraseña` e `imagen de perfil`|

---

### ⚠️ Ruta de Error

|Ruta|Componente|Descripción|
|:---|:---|:---:|
|`/*`|`NotFoundPage`|Página mostrada cuando la ruta no existe (Error 404)|

---

### 🧩 Resumen del Flujo

1. **Usuarios no autenticados** pueden acceder a las rutas bajo `/auth` (`/auth`, `/auth/register`).  
2. **Usuarios autenticados** pueden acceder a `/product`, `/product/:id` y `/logs`.  
3. Cualquier ruta no definida redirige a la **página 404** (`NotFoundPage`).
