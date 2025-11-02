# Documentación de Rutas Backend (Productos, Usuarios y Logs)

## 📦 Rutas de Producto (`/products`)

---

### 🟢 Obtener todos los productos

- `/products/` - **GET**
Ruta encargada de obtener una lista de **todos los productos** disponibles.

Headers:
```ts
// No requiere
```
Returns:
|Código|Número|Mensaje|
|:---:|:---:|:---:|
|OK|200|Lista de productos devuelta exitosamente (array de objetos Producto)|
|Error|500|Error interno del servidor al buscar los productos|

Obtener un producto por ID
- `/products/:id` - GET Ruta encargada de obtener los detalles de un producto específico por su ID.

Parámetros de Ruta (req.params):

```ts
{
  id: 'integer' // ID del producto a buscar
}
```

Headers:
```ts
// No requiere
```

Returns:
|Código|Número|Mensaje|
|:---:|:---:|:---:|
|OK|200|Producto encontrado y devuelto (objeto Producto)|
|No Encontrado|404|Producto no encontrado con el ID proporcionado|
|Error|500|Error interno del servidor al buscar el producto|

### ➕ Crear un nuevo producto
- `/products/` - POST Ruta encargada de facilitar la creación de un nuevo producto. Requiere autenticación (JWT).

- Body (req.body):

```ts
{
  full_name: 'string', 
  price: 'decimal', 
  stock: 'integer'
}
```

Ejemplo creación de producto:
```ts
{
  full_name: 'Banana', 
  price: 1030, 
  stock: 250
}
```
Headers:
{
  authorization: "Bearer <token>" // Token JWT para autenticación
}

Returns:
|Código|Número|Mensaje|
|:---:|:---:|:---:|
|OK|200|Producto creado exitosamente (devuelve el objeto del nuevo Producto)|
|No Autorizado|401|No autorizado, falta el token ({ error: "No autorizado" })|
|No Autorizado|401|Error al verificar el token (ej. token expirado/inválido)|
|No Encontrado|404|Usuario no encontrado (a pesar de tener un token válido)|

### ✏️ Modificar un producto existente
- `/products/:id` - PUT Ruta encargada de modificar un producto existente por su ID. Requiere autenticación (JWT).

Parámetros de Ruta (req.params):

```ts
{
  id: 'integer' // ID del producto a modificar
}
```

Body (req.body):
```ts
{
  full_name: 'string', 
  price: 'decimal', 
  stock: 'integer'
}
```

Ejemplo cambio del producto ingresado:

```ts
//En la ruta
{
  id: 1
}
//En los campos a rellenar
{
  full_name: "Banana", 
  price: 1030, 
  stock: 251
}
```

Headers:
```ts
{
  authorization: "Bearer <token>" // Token JWT para autenticación
}
```

Returns:
|Código|Número|Mensaje|
|:---:|:---:|:---:|
|OK|200|Producto modificado exitosamente (devuelve el objeto del Producto actualizado)|
|No Autorizado|401|No autorizado, falta el token ({ error: "No autorizado" })|
|No Autorizado|401|Error al verificar el token o error de base de datos|
|No Encontrado|404|Usuario no encontrado (a pesar de tener un token válido)|
|OK|200|Producto no encontrado con el ID proporcionado (retorna { error: "Producto no encontrado" })|

### ❌ Eliminar un producto
- `/products/:id` - DELETE Ruta encargada de eliminar un producto existente por su ID. Requiere autenticación (JWT).

Parámetros de Ruta (req.params):

```ts
{
  id: 'integer' // ID del producto a eliminar
}
```

Headers:
```ts
{
  authorization: "Bearer <token>" // Token JWT para autenticación
}
```

Returns:
|Código|Número|Mensaje|
|:---:|:---:|:---:|
|OK|200|Producto eliminado exitosamente ({ message: "Producto eliminado" })|
|No Autorizado|401|No autorizado, falta el token ({ error: "No autorizado" })|
|No Autorizado|401|Error al verificar el token|
|OK|200|Producto no encontrado con el ID proporcionado (retorna { error: "Producto no encontrado" })|

## 👤 Rutas de Usuario (`/user`)
### 👥 Obtener todos los usuarios
- `/user/` - GET Ruta encargada de obtener una lista de todos los usuarios.

Headers:
```ts
// No requiere
```
|Código|Número|Mensaje|
|:---:|:---:|:---:|
|OK|200|Lista de usuarios devuelta exitosamente (devuelve { error: false, users: [...] })|

### 📝 Registrar un nuevo usuario
- `/user/register` - POST Ruta encargada de registrar un nuevo usuario en el sistema.

Body (req.body):
```ts
{
  full_name: 'string', 
  email: 'string', 
  password: 'string',
  confirmPassword: 'string' // Debe coincidir con 'password'
}
```

Ejemplo creación de usuario:
```ts
{
    full_name:"Juan",
    email:"juan@gmail.com",
    password:"123",
    confirmPassword:"123"
}
```

Headers:
```ts
// No requiere
```

Returns:
|Código|Número|Mensaje|
|:---:|:---:|:---:|
|OK|200|Usuario creado exitosamente ({ error: false, msg: "Usuario creado" })|
|Conflicto|403|Las contraseñas no coinciden|
|Error|400|Error de validación o al crear el usuario (ej. email ya existe)|

### 🔑 Iniciar sesión (Login)
- `/user/login` - POST Ruta encargada de autenticar un usuario y generar un token de acceso (JWT).

Body (req.body):

```ts
{
  email: 'string', 
  password: 'string'
}
```

Ejemplo inicio de sesión:
```ts
{
  email:"juan@gmail.com",
  password:123
}
```

Headers:

```ts
// No requiere
```

Returns:
|Código|Número|Mensaje|
|:---:|:---:|:---:|
|OK|200|Inicio de sesión exitoso, devuelve los datos del usuario y el token|
|No Encontrado|404	El usuario no existe|
|Conflicto|403|Contraseña incorrecta|
|Error|500|Error interno del servidor al iniciar sesión|

### ✅ Verificar Token
- `/user/verify-token` - GET Ruta encargada de verificar la validez de un token JWT.

Headers:
```ts
{
  authorization: "Bearer <token>" // Token JWT a verificar
}
```

Returns:
|Código|Número|Mensaje|
|:---:|:---:|:---:|
|OK|200|Token válido (devuelve { error: false })|
|OK|200|Token no válido, expirado o faltante (devuelve { error: true })|

## 📜 Rutas de Logs (`/logs`)
### 📖 Obtener Logs de Productos
- `/logs/products` - GET Ruta encargada de obtener los logs o datos de productos (controlada por getProductLogs).

Headers:
```ts
//No requiere
```

Returns:
|Código|Número|Mensaje|
|:---:|:---:|:---:|
|OK|200|Lista de logs de productos|
|Error|500|Error al obtener los logs|

### 👤 Obtener Logs de Usuarios
- `/logs/users` - GET Ruta encargada de obtener los logs o datos de usuarios (controlada por getUserLogs).

Headers:
```ts
//No requiere
```

Returns:
|Código|Número|Mensaje|
|:---:|:---:|:---:|
|OK|200|Lista de logs de usuarios devueltos|
|Error|500|Error al obtener los logs de usuarios|