import { Router } from "express"
import { Products, User } from "../models/associations.mjs" 
import { getProductLogs } from "../controllers/logsController.mjs"
import { authenticateToken, isAdmin } from "../middleware/auth.mjs" // ⭐ Importar isAdmin
import { validateProduct, validateId } from "../middleware/validation.mjs"

export const productRoutes = Router()

// Ruta GET para obtener TODOS los productos (pública)
productRoutes.get("/", async (req, res) => {
    try {
        const products = await Products.findAll()
        res.json(products)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Ruta LOGS para ver quién creó o modificó productos (protegida - solo admin)
productRoutes.get("/logs", authenticateToken, isAdmin, getProductLogs) // ⭐ Agregado isAdmin

// Ruta GET para obtener UN producto por ID (pública)
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

// ⭐ Ruta POST para crear producto (SOLO ADMIN)
productRoutes.post("/", authenticateToken, isAdmin, async (req, res) => {
    try {
        const { name, price, stock } = req.body
        
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return res.status(400).json({ error: "El nombre es obligatorio" })
        }
        
        if (typeof price !== 'number' || price <= 0) {
            return res.status(400).json({ error: "El precio debe ser mayor a 0" })
        }
        
        if (typeof stock !== 'number' || stock < 0) {
            return res.status(400).json({ error: "El stock no puede ser negativo" })
        }
        
        const newProduct = await Products.create({ 
            name: name.trim(), 
            price, 
            stock,
            created_by: req.user.id
        })
        
        res.json(newProduct)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// ⭐ Ruta PUT para modificar producto (SOLO ADMIN)
productRoutes.put("/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params
        const { name, price, stock } = req.body
        
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return res.status(400).json({ error: "El nombre es obligatorio" })
        }
        
        if (typeof price !== 'number' || price <= 0) {
            return res.status(400).json({ error: "El precio debe ser mayor a 0" })
        }
        
        if (typeof stock !== 'number' || stock < 0) {
            return res.status(400).json({ error: "El stock no puede ser negativo" })
        }
        
        const product = await Products.findByPk(id)
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" })
        }
        
        product.name = name.trim()
        product.price = price
        product.stock = stock
        product.modified_by = req.user.id
        
        await product.save()
        res.json(product)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// ⭐ Ruta DELETE para eliminar un producto (SOLO ADMIN)
productRoutes.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params
        
        const product = await Products.findByPk(id)
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" })
        }

        await product.destroy()
        res.json({ message: "Producto eliminado correctamente" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})