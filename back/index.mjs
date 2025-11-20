import express from "express"
import "dotenv/config"
import cors from "cors"
import { conn } from "./config/db.mjs"
import { productRoutes } from "./routes/product.mjs"
import { userRoutes } from "./routes/user.mjs"
import { checkoutRoutes } from "./routes/checkout.mjs"
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

// ✅ CONFIGURACIÓN MEJORADA DE ARCHIVOS ESTÁTICOS
const uploadsPath = path.join(__dirname, 'uploads')

// Crear carpetas necesarias si no existen
const requiredDirs = [
  uploadsPath,
  path.join(uploadsPath, 'profiles'),
  path.join(uploadsPath, 'profiles', 'products')
]

requiredDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    console.log(`✅ Carpeta creada: ${dir}`)
  }
})

// Servir archivos estáticos con configuración correcta
app.use('/uploads', express.static(uploadsPath))

// Log de archivos servidos (útil para debugging)
app.use('/uploads', (req, res, next) => {
  console.log(`📁 Sirviendo archivo: ${req.url}`)
  next()
})

// Rutas
app.use("/products", productRoutes)
app.use("/users", userRoutes)
app.use("/checkout", checkoutRoutes)

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  })
})

// Configurar asociaciones de Sequelize
const models = { User, Products }
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models)
  }
})

// Iniciar servidor express
app.listen(PORT, () => {
  try {
    console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`)
    console.log(`📁 Archivos estáticos en http://localhost:${PORT}/uploads`)
    
    // Sincronizar base de datos
    conn.sync()
    console.log('✅ Base de datos sincronizada')
    console.log('✅ Asociaciones de Sequelize configuradas')
    console.log('✅ Sistema de archivos configurado')
    
  } catch (error) {
    console.error("❌ No se pudo iniciar el servidor: ", error.message)
  }
})