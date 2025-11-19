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
            unique: true,
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
        image: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'notimage.png',
            validate: {
                len: {
                    args: [0, 255],
                    msg: "El nombre de la imagen no puede superar 255 caracteres"
                }
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