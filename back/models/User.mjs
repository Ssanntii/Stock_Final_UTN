import { DataTypes, Model } from 'sequelize'
import { conn } from "../config/db.mjs"


export class User extends Model {

}

User.init({
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isAlpha: {
        msg: "El nombre no puede contener números o caracteres especiales"
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
  sequelize: conn
})