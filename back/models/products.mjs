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
            type: DataTypes.DECIMAL(10, 2), // 10 dígitos totales, 2 decimales
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
        }
    },
    {
        sequelize: conn,
        tableName: "products"
    }
)