import { Products, User } from '../models/associations.mjs' // Importar desde associations

export const getProductLogs = async (req, res) => {
    try {
        // ✅ UNA SOLA QUERY con includes - Sin N+1
        const products = await Products.findAll({
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'full_name', 'email'],
                    required: false
                },
                {
                    model: User,
                    as: 'modifier',
                    attributes: ['id', 'full_name', 'email'],
                    required: false
                }
            ],
            order: [['updatedAt', 'DESC']]
        })

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