// Guia https://sequelize.org/docs/v6/core-concepts/model-basics/

// Crear modelo a partir de SEQUELIZE
import { DataTypes, Model } from "sequelize"
import { conn } from "../config/db.mjs"

// Opción Extending Model
export class Products extends Model {}

Products.init(
    // El modelo debe contener:
    {
        // id INTEGER
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        // name STRING
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
        // price FLOAT
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
        // stock INTEGER
        stock: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                isInt: {
                    msg: "El stock debe ser un número entero"
                },
                min: {
                    args: 0,
                    msg: "El stock no puede ser negativo"
                }
            }
        }
    },
    {
        sequelize: conn,
        modelName: "Products",
        tableName: "products",
        datetimes: true,
        // created_at DATETIME  - Lo crea SEQUELIZE automaticamente
        createdAt: "created_at",
        // updated_at DATETIME - Lo crea SEQUELIZE automaticamente
        updatedAt: "updated_at"
    }
)




