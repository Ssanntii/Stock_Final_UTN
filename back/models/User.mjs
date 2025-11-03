import { DataTypes, Model } from 'sequelize'
import { conn } from "../config/db.mjs"

export class User extends Model {}

User.init({
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: {
        args: /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/i,
        msg: "El nombre no puede contener números ni caracteres especiales"
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: "Ya existe un usuario registrado con ese email"
    },
    validate: {
      isEmail: {
        msg: "Coloque un email valido"
      }
    }
  },
  hash: {
    type: DataTypes.CHAR(60),
    allowNull: false
  },
  isActivate: {
    type: DataTypes.BOOLEAN,
    default: 0
  },
  activateToken: {
    type: DataTypes.STRING
  }
}, {
  tableName: "users",
  sequelize: conn,
  timestamps: true
})

// Definir asociaciones como función estática
User.associate = (models) => {
  // Productos creados por este usuario
  User.hasMany(models.Products, {
    as: 'createdProducts',
    foreignKey: 'created_by'
  })
  
  // Productos modificados por este usuario
  User.hasMany(models.Products, {
    as: 'modifiedProducts',
    foreignKey: 'modified_by'
  })
}