// GUIA https://expressjs.com/en/guide/routing.html

// Importar Express
import express from "express"
import "dotenv/config"
import cors from "cors"
import { conn } from "./config/db.mjs"
import { productRoutes } from "./routes/product.mjs"
import { userRoutes } from "./routes/user.mjs"
import logsRoutes from "./routes/logs.mjs"

// Crear servidor Express
const app = express()
const PORT = process.argv[2] ?? 3000

// Configurar CORS
app.use(cors())

// Agregar a express el soporte para JSON
app.use(express.json())

app.use("/api/logs", logsRoutes)
app.use("/products", productRoutes)
app.use("/users", userRoutes)

// Iniciar servidor express

app.listen(PORT, () => {
    try{
        console.log(`Servidor iniciado en http://localhost:${PORT}`)
        // Dentro de la función hay que agregar sequelize.sync()
        conn.sync()
    } catch (error) {
        console.error("No se pudo iniciar el servidor: ", error.message)
    }
})
