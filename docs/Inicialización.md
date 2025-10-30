# Inicialización

> [!WARNING]
> Debemos asignar nuestras variables de entorno en un archivo ".env".
>
>  Copiamos las variables de ".env-example".
>
> ```plain
> USER= tu_usuario
> PASSWORD= tu_contraseña
> HOST= localhost o ip
> PORT= puerto
> DATABASE= nombre_db
> DIALECT= mysql, postgresql, mariadb
> SECRET= tu_key_secreta
> ```
>
> Estas son las variables de entorno para el back.

> [!IMPORTANT]
>1. En la misma terminal o en una nueva deberemos crear la base de datos con los datos ingresados en el .env.
>```pws
>mysql -u tu_usuario -p
>```
>Luego nos pedirá la contraseña, la ingresamos.

> [!NOTE]
>Si se accedió correctamente, deberá ver un mensaje similar al siguiente
>```pgsql
>Welcome to the MySQL monitor.  Commands end with ; or \g.
>Your MySQL connection id is 36
>Server version: 9.4.0 MySQL Community Server - GPL
>```

Debemos proceder a la creación de la base de datos

```pws
CREATE DATABASE nombre_db;
```

Luego podemos verificar su creación
```pws
SHOW DATABASES;
```
> [!NOTE]
>Deberá aparecer el nombre de la base nueva
>```pgsql
>+--------------------+
>| Database           |
>+--------------------+
>| information_schema |
>| mysql              |
>| performance_schema |
>| nombre_db          |
>+--------------------+
>```
Si se creó correctamente podemos salir de mysql en esa terminal.
```pws
EXIT;
```

2. Parandonos en la ruta principal, accedemos al back y con la terminal iniciamos el servidor.
```pws
cd ../back
npm run dev
```
> [!NOTE]
> Deberíamos ver el siguiente mensaje en la consola.
>
> ```pws
> Servidor iniciado en http://localhost:3000
> ```
>
> Este mensaje lo usaremos para asignar nuestra variable de entorno en el front.

> [!WARNING]
> Debemos asignar nuestras variables de entorno en un archivo ".env".
>
>  Copiamos las variables de ".env-example".
>
> ```plain
> VITE_URL="apiurl"
> ```
>
> Estas es la variable de entorno para el front.
> apiurl es el mensaje que nos sale en consola en el backend. Por ejemplo: "http://localhost:3000"

3. Iniciamos una terminal nueva iniciamos el servidor.
```pws
cd front
npm run dev
```

- A partir de aqui podremos entrar al link desde la terminal del front.
```pws
  VITE v7.1.12  ready in 604 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```