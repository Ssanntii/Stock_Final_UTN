import { User } from './User.mjs'
import { Products } from './Product.mjs'

// Definir todas las asociaciones aquí
// Products -> User
Products.belongsTo(User, {
    as: 'creator',
    foreignKey: 'created_by'
})

Products.belongsTo(User, {
    as: 'modifier',
    foreignKey: 'modified_by'
})

// User -> Products (opcional, solo si las necesitas)
User.hasMany(Products, {
    as: 'createdProducts',
    foreignKey: 'created_by'
})

User.hasMany(Products, {
    as: 'modifiedProducts',
    foreignKey: 'modified_by'
})

// Re-exportar los modelos
export { User, Products }