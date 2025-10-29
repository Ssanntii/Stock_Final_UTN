import { DataTypes, Model } from "sequelize"
import { conn } from "../config/db.mjs"

export class Products extends Model {}

Products.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "El nombre es obligatorio"
                },
                notEmpty: {
                    msg: "El nombre no puede estar vacío"
                }
            }
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                isDecimal: {
                    msg: "El precio debe ser un número decimal válido"
                },
                min: 0
            }
        },
        stock: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        modified_by: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            }
        }
    },
    {
        sequelize: conn,
        tableName: "products",
        timestamps: true
    }
)

// Definir asociaciones como función estática
Products.associate = (models) => {
    // Producto creado por un usuario
    Products.belongsTo(models.User, {
        as: 'creator',
        foreignKey: 'created_by'
    })
    
    // Producto modificado por un usuario
    Products.belongsTo(models.User, {
        as: 'modifier',
        foreignKey: 'modified_by'
    })
}