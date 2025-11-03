import { Products } from '../models/Product.mjs'
import { User } from '../models/User.mjs'

export const getProductLogs = async (req, res) => {
    try {
        const products = await Products.findAll({
            order: [['updatedAt', 'DESC']]
        })

        // Obtener los usuarios manualmente
        const logs = await Promise.all(products.map(async (product) => {
            let creator = null
            let modifier = null

            if (product.created_by) {
                const creatorUser = await User.findByPk(product.created_by, {
                    attributes: ['id', 'full_name', 'email']
                })
                if (creatorUser) {
                    creator = {
                        id: creatorUser.id,
                        name: creatorUser.full_name,
                        email: creatorUser.email
                    }
                }
            }

            if (product.modified_by) {
                const modifierUser = await User.findByPk(product.modified_by, {
                    attributes: ['id', 'full_name', 'email']
                })
                if (modifierUser) {
                    modifier = {
                        id: modifierUser.id,
                        name: modifierUser.full_name,
                        email: modifierUser.email
                    }
                }
            }

            return {
                id: product.id,
                name: product.name,
                price: product.price,
                stock: product.stock,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
                createdBy: creator,
                modifiedBy: modifier
            }
        }))

        res.json(logs)
    } catch (error) {
        console.error('Error en getProductLogs:', error)
        res.status(500).json({ 
            message: 'Error al obtener los logs',
            error: error.message
        })
    }
}