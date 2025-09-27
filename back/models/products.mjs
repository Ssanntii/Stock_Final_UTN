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
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                isNumeric: {
                    msg: "El precio debe ser un número"
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
        // Definir explícitamente los timestamps
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
            field: 'createdAt'
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
            field: 'updatedAt'
        }
    },
    {
        sequelize: conn,
        modelName: "Products",
        tableName: "products",
        timestamps: true,
        // Agregar hooks para manejar updatedAt manualmente
        hooks: {
            beforeUpdate: (product, options) => {
                product.updatedAt = new Date();
            }
        }
    }
)