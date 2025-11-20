import { Router } from "express"
import { Products } from '../models/Product.mjs'
import { authenticateToken } from '../middleware/auth.mjs'
import { sendPurchaseConfirmation } from '../utils/emailService.mjs'
import { conn } from '../config/db.mjs'

export const checkoutRoutes = Router()

/**
 * ✅ Procesar compra
 * POST /checkout
 * Requiere autenticación
 */
checkoutRoutes.post("/", authenticateToken, async (req, res) => {
  const transaction = await conn.transaction()

  try {
    const { items } = req.body // Array de { id, quantity }
    const user = req.user

    // Validar que haya items
    if (!items || !Array.isArray(items) || items.length === 0) {
      await transaction.rollback()
      return res.status(400).json({
        error: true,
        msg: "No se enviaron productos para comprar"
      })
    }

    // Validar formato de items
    for (const item of items) {
      if (!item.id || !item.quantity || item.quantity <= 0) {
        await transaction.rollback()
        return res.status(400).json({
          error: true,
          msg: "Formato de productos inválido"
        })
      }
    }

    // Obtener todos los productos con lock para evitar race conditions
    const productIds = items.map(item => item.id)
    const products = await Products.findAll({
      where: {
        id: productIds
      },
      lock: transaction.LOCK.UPDATE,
      transaction
    })

    // Verificar que todos los productos existan
    if (products.length !== items.length) {
      await transaction.rollback()
      return res.status(404).json({
        error: true,
        msg: "Uno o más productos no existen"
      })
    }

    // Crear mapa de productos para acceso rápido
    const productMap = {}
    products.forEach(product => {
      productMap[product.id] = product
    })

    // Validar stock y calcular total
    const orderItems = []
    let total = 0
    const errors = []

    for (const item of items) {
      const product = productMap[item.id]

      if (product.stock < item.quantity) {
        errors.push(`${product.name}: stock insuficiente (disponible: ${product.stock}, solicitado: ${item.quantity})`)
        continue
      }

      const subtotal = product.price * item.quantity

      orderItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        subtotal
      })

      total += subtotal
    }

    // Si hay errores de stock, abortar
    if (errors.length > 0) {
      await transaction.rollback()
      return res.status(400).json({
        error: true,
        msg: "Stock insuficiente para algunos productos",
        errors
      })
    }

    // Actualizar stock de productos
    for (const item of orderItems) {
      const product = productMap[item.id]
      product.stock -= item.quantity
      await product.save({ transaction })
    }

    // Generar número de orden
    const orderNumber = `ORD-${Date.now()}-${user.id}`
    const orderDate = new Date().toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    // Commit de la transacción
    await transaction.commit()

    // Enviar email de confirmación (sin bloquear la respuesta)
    sendPurchaseConfirmation(user.email, user.full_name, {
      items: orderItems,
      total,
      orderNumber,
      date: orderDate
    }).catch(error => {
      console.error('Error al enviar email de confirmación:', error)
    })

    // Responder con éxito
    res.json({
      error: false,
      msg: "Compra realizada con éxito",
      order: {
        orderNumber,
        items: orderItems,
        total,
        date: orderDate
      }
    })

  } catch (error) {
    // Rollback en caso de error
    if (transaction) await transaction.rollback()

    console.error('Error en checkout:', error)
    res.status(500).json({
      error: true,
      msg: "Error al procesar la compra",
      details: error.message
    })
  }
})