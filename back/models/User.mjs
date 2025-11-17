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
  profile_picture: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
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