import { Router } from "express"
import { Products } from "../models/Product.mjs"
import { getProductLogs } from "../controllers/logsController.mjs"
import { authenticateToken } from "../middleware/auth.mjs"
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

// Ruta LOGS para ver quién creó o modificó productos (protegida)
productRoutes.get("/logs", authenticateToken, getProductLogs)

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

// Ruta POST para crear producto (protegida)
productRoutes.post("/", authenticateToken, async (req, res) => {
    try {
        const { name, price, stock } = req.body
        
        // Validaciones de entrada
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return res.status(400).json({ error: "El nombre es obligatorio" })
        }
        
        if (typeof price !== 'number' || price <= 0) {
            return res.status(400).json({ error: "El precio debe ser mayor a 0" })
        }
        
        if (typeof stock !== 'number' || stock < 0) {
            return res.status(400).json({ error: "El stock no puede ser negativo" })
        }
        
        // Crear producto usando el usuario del middleware
        const newProduct = await Products.create({ 
            name: name.trim(), 
            price, 
            stock,
            created_by: req.user.id  // ✅ Usuario ya disponible desde el middleware
        })
        
        res.json(newProduct)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Ruta PUT para modificar producto (protegida)
productRoutes.put("/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params
        const { name, price, stock } = req.body
        
        // Validaciones de entrada
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return res.status(400).json({ error: "El nombre es obligatorio" })
        }
        
        if (typeof price !== 'number' || price <= 0) {
            return res.status(400).json({ error: "El precio debe ser mayor a 0" })
        }
        
        if (typeof stock !== 'number' || stock < 0) {
            return res.status(400).json({ error: "El stock no puede ser negativo" })
        }
        
        // Buscar producto
        const product = await Products.findByPk(id)
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" })
        }
        
        // Actualizar producto
        product.name = name.trim()
        product.price = price
        product.stock = stock
        product.modified_by = req.user.id  // ✅ Usuario ya disponible desde el middleware
        
        await product.save()
        res.json(product)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Ruta DELETE para eliminar un producto (protegida)
productRoutes.delete("/:id", authenticateToken, async (req, res) => {
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