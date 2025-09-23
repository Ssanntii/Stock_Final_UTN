// GUIA https://expressjs.com/en/guide/routing.html

// Importar Express
import express from "express"
import { conn } from "./config/db.mjs"
import { Products } from "./models/products.mjs"
import dotenv from "dotenv"


dotenv.config()

// Crear servidor Express
const app = express()
const port = process.env.PORT || 3000

// Dentro de la función hay que agregar sequelize.sync()
await conn.sync()
console.log("Conectado a la base de datos")

// Agregar a express el soporte para JSON
app.use(express.json())

// Crear Ruta GET para obtener productos
app.get("/products", async (req, res) => {
    try {
        const products = await Products.findAll()
        res.json(products)
    } catch (error) {
        res.json({ error: error.message})
    }
})

// Crear Ruta POST para crear producto
app.post("/products", async (req, res) => {
    try {
        const { name, price, stock } = req.body
        const newProduct = await Products.create({ name, price, stock})
        res.json(newProduct)   
    } catch (error) {
        res.json({ error: error.message})
    }
})

// Crear Ruta PUT para modificar producto
app.put("/products/:id", async (req, res) => {
    try {
        const { id } = req.params
        const { name, price, stock } = req.body
        const product = await Products.findByPk(id)
        if (!product) return res.json({ error: "Producto no encontrado" })
        
        product.name = name
        product.price = price
        product.stock = stock
        await product.save()
        res.json(product)
    } catch (error) {
        res.json({ error: error.message})
    }
})

// Crear Ruta DELETE para eliminar un producto
app.delete("/products/:id", async (req, res) => {
    try {
        const { id } = req.params
        const product = await Products.findByPk(id)
        if (!product) return res.json({ error: "Producto no encontrado" })

        await product.destroy()
        res.json({ message: "Producto eliminado" })
    } catch (error) {
        res.json({ error: error.message})
    }
})

// Iniciar servidor express
try{
    app.listen(port, async () => {
        console.log(`Servidor escuchando en http://localhost:${port}`)
    })
} catch (error) {
    console.error("No se pudo iniciar el servidor: ", error.message)
}
