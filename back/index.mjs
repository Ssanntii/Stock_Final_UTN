import express from "express"
import "dotenv/config"
import cors from "cors"
import { conn } from "./config/db.mjs"
import { productRoutes } from "./routes/product.mjs"
import { userRoutes } from "./routes/user.mjs"
import { User } from "./models/User.mjs"
import { Products } from "./models/Product.mjs"
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

// IMPORTANTE: Importar associations para que se carguen las relaciones
import "./models/associations.mjs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Crear servidor Express
const app = express()
const PORT = process.argv[2] ?? 3000

// Configurar CORS
app.use(cors())

// Agregar a express el soporte para JSON
app.use(express.json())

// Servir archivos estáticos (fotos de perfil)
const uploadsPath = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true })
}

const profilesPath = path.join(uploadsPath, 'profiles')
if (!fs.existsSync(profilesPath)) {
  fs.mkdirSync(profilesPath, { recursive: true })
}

app.use('/uploads', express.static(uploadsPath))

// Rutas
app.use("/products", productRoutes)
app.use("/users", userRoutes)

// Configurar asociaciones de Sequelize
const models = { User, Products }
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models)
  }
})

// Iniciar servidor express
app.listen(PORT, () => {
    try{
        console.log(`Servidor iniciado en http://localhost:${PORT}`)
        // Dentro de la función hay que agregar sequelize.sync()
        conn.sync()
        console.log('✅ Asociaciones de Sequelize configuradas correctamente')
        console.log('✅ Carpeta de uploads configurada')
    } catch (error) {
        console.error("No se pudo iniciar el servidor: ", error.message)
    }
})