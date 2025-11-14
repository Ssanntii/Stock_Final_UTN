# 📦 Exportación de Datos a Excel y CSV

Se permite la descarga listados de registros (logs) en productos.

Al ingresar a la ruta `/logs` se permite crear:

✔ Un archivo Excel (.xlsx)

✔ Un archivo CSV (.csv)


### 🌐 Información exportada

- ID

- Nombre

- Precio

- Stock

- Fecha de creación

- Usuario que creó el registro

- Ultimo usuario que lo modificó

- Fecha de creación/modificación

- Correos electronicos de creador/modificador.

Ejemplo de datos enviados al xlsx/csv

```ts
const logExample = [
  {
    id: 1,
    nombre: "Producto A",
    precio: 150,
    stock: 20,
    createdAt: "2024-06-12T14:30:00",
    createdBy: { name: "Juan", email: "juan@gmail.com" },
    updatedAt: "2024-06-12T14:30:00",
    modifiedBy: null
  }
]
```