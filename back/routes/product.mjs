import { Router } from "express"
import { Products, User } from "../models/associations.mjs" 
import { getProductLogs } from "../controllers/logsController.mjs"
import { authenticateToken, isAdmin } from "../middleware/auth.mjs"
import { validateProduct, validateId } from "../middleware/validation.mjs"
import { uploadProductImage } from "../config/multer.mjs"
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
productRoutes.get("/logs", authenticateToken, isAdmin, getProductLogs)

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

// Ruta POST para crear producto (SOLO ADMIN) - CON IMAGEN
productRoutes.post("/", authenticateToken, isAdmin, uploadProductImage.single('image'), async (req, res) => {
    try {
        const { name, price, stock } = req.body
        
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return res.status(400).json({ error: "El nombre es obligatorio" })
        }
        
        const priceNum = parseFloat(price)
        if (isNaN(priceNum) || priceNum <= 0) {
            return res.status(400).json({ error: "El precio debe ser mayor a 0" })
        }
        
        const stockNum = parseInt(stock)
        if (isNaN(stockNum) || stockNum < 0) {
            return res.status(400).json({ error: "El stock no puede ser negativo" })
        }
        
        // Si se subió una imagen, usar su nombre; si no, usar la imagen por defecto
        const imageName = req.file ? req.file.filename : 'notimage.png'
        
        const newProduct = await Products.create({ 
            name: name.trim(), 
            price: priceNum, 
            stock: stockNum,
            image: imageName,
            created_by: req.user.id
        })
        
        res.json(newProduct)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// ✅ Ruta PUT mejorada con soporte para eliminar imagen
productRoutes.put("/:id", authenticateToken, isAdmin, uploadProductImage.single('image'), async (req, res) => {
    try {
        const { id } = req.params
        const { name, price, stock, remove_image } = req.body
        
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return res.status(400).json({ error: "El nombre es obligatorio" })
        }
        
        const priceNum = parseFloat(price)
        if (isNaN(priceNum) || priceNum <= 0) {
            return res.status(400).json({ error: "El precio debe ser mayor a 0" })
        }
        
        const stockNum = parseInt(stock)
        if (isNaN(stockNum) || stockNum < 0) {
            return res.status(400).json({ error: "El stock no puede ser negativo" })
        }
        
        const product = await Products.findByPk(id)
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" })
        }
        
        // ✅ Si se marca para eliminar imagen
        if (remove_image === 'true') {
            // Eliminar la imagen anterior si no es la imagen por defecto
            if (product.image && product.image !== 'notimage.png') {
                const oldImagePath = path.join(__dirname, '../uploads/profiles/products', product.image)
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath)
                }
            }
            product.image = 'notimage.png'
        }
        // Si se subió una nueva imagen
        else if (req.file) {
            // Eliminar la imagen anterior si no es la imagen por defecto
            if (product.image && product.image !== 'notimage.png') {
                const oldImagePath = path.join(__dirname, '../uploads/profiles/products', product.image)
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath)
                }
            }
            product.image = req.file.filename
        }
        
        product.name = name.trim()
        product.price = priceNum
        product.stock = stockNum
        product.modified_by = req.user.id
        
        await product.save()
        res.json(product)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Ruta DELETE para eliminar un producto (SOLO ADMIN)
productRoutes.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params
        
        const product = await Products.findByPk(id)
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" })
        }

        // Eliminar la imagen del producto si no es la imagen por defecto
        if (product.image && product.image !== 'notimage.png') {
            const imagePath = path.join(__dirname, '../uploads/profiles/products', product.image)
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath)
            }
        }

        await product.destroy()
        res.json({ message: "Producto eliminado correctamente" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})