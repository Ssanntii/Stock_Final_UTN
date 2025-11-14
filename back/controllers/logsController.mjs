import { Products } from '../models/Product.mjs'
import { User } from '../models/User.mjs'

export const getProductLogs = async (req, res) => {
    try {
        // ✅ UNA SOLA QUERY con includes - Sin N+1
        const products = await Products.findAll({
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'full_name', 'email']
                },
                {
                    model: User,
                    as: 'modifier',
                    attributes: ['id', 'full_name', 'email']
                }
            ],
            order: [['updatedAt', 'DESC']]
        })

        // Mapear los resultados al formato deseado
        const logs = products.map(product => ({
            id: product.id,
            name: product.name,
            price: product.price,
            stock: product.stock,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            createdBy: product.creator ? {
                id: product.creator.id,
                name: product.creator.full_name,
                email: product.creator.email
            } : null,
            modifiedBy: product.modifier ? {
                id: product.modifier.id,
                name: product.modifier.full_name,
                email: product.modifier.email
            } : null
        }))

        res.json(logs)
        
    } catch (error) {
        console.error('Error en getProductLogs:', error)
        res.status(500).json({ 
            error: true,
            message: 'Error al obtener los logs',
            details: error.message
        })
    }
}