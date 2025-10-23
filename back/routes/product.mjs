import { Router } from "express"
import { Products } from "../models/Products.mjs"

export const productRoutes = Router()

// Crear Ruta GET para obtener TODOS los productos
productRoutes.get("/", async (req, res) => {
    try {
        const products = await Products.findAll()
        res.json(products)
    } catch (error) {
        res.json({ error: error.message})
    }
})

// Crear Ruta GET para obtener UN producto por ID
productRoutes.get("/:id", async (req, res) => {
    try {
        const { id } = req.params
        const product = await Products.findByPk(id)
        
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" })
        }
        
        res.json(product)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Crear Ruta POST para crear producto
productRoutes.post("/", async (req, res) => {
    try {
        const { name, price, stock } = req.body
        const newProduct = await Products.create({ name, price, stock})
        res.json(newProduct)   
    } catch (error) {
        res.json({ error: error.message})
    }
})

// Crear Ruta PUT para modificar producto
productRoutes.put("/:id", async (req, res) => {
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
productRoutes.delete("/:id", async (req, res) => {
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