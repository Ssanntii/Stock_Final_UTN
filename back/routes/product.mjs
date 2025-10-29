import { Router } from "express"
import { Products } from "../models/Product.mjs"
import { User } from "../models/User.mjs"
import jwt from 'jsonwebtoken'

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
        // Verificar token
        const auth = req.headers.authorization
        if (!auth) {
            return res.status(401).json({ error: "No autorizado" })
        }

        const token = auth.split(" ")[1]
        const decoded = jwt.verify(token, process.env.SECRET)
        
        const user = await User.findOne({ where: { email: decoded.email } })
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" })
        }

        // Crear producto con el ID del usuario
        const { name, price, stock } = req.body
        const newProduct = await Products.create({ 
            name, 
            price, 
            stock,
            created_by: user.id
        })
        res.json(newProduct)   
    } catch (error) {
        res.status(401).json({ error: error.message })
    }
})

// Crear Ruta PUT para modificar producto
productRoutes.put("/:id", async (req, res) => {
    try {
        // Verificar token
        const auth = req.headers.authorization
        if (!auth) {
            return res.status(401).json({ error: "No autorizado" })
        }

        const token = auth.split(" ")[1]
        const decoded = jwt.verify(token, process.env.SECRET)
        
        const user = await User.findOne({ where: { email: decoded.email } })
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" })
        }

        // Actualizar producto
        const { id } = req.params
        const { name, price, stock } = req.body
        const product = await Products.findByPk(id)
        if (!product) return res.json({ error: "Producto no encontrado" })
        
        product.name = name
        product.price = price
        product.stock = stock
        product.modified_by = user.id
        await product.save()
        res.json(product)
    } catch (error) {
        res.status(401).json({ error: error.message })
    }
})

// Crear Ruta DELETE para eliminar un producto
productRoutes.delete("/:id", async (req, res) => {
    try {
        // Verificar token
        const auth = req.headers.authorization
        if (!auth) {
            return res.status(401).json({ error: "No autorizado" })
        }

        const token = auth.split(" ")[1]
        jwt.verify(token, process.env.SECRET)

        const { id } = req.params
        const product = await Products.findByPk(id)
        if (!product) return res.json({ error: "Producto no encontrado" })

        await product.destroy()
        res.json({ message: "Producto eliminado" })
    } catch (error) {
        res.status(401).json({ error: error.message })
    }
})