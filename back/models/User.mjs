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
   verification_code: {
    type: DataTypes.STRING(6),
    allowNull: true,
    comment: 'Código de 6 dígitos para verificar email'
  },
  verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Indica si el usuario ha verificado su email'
  },
  verification_code_expires: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Fecha de expiración del código de verificación (opcional)'
  }
}, {
  tableName: "users",
  sequelize: conn,
  timestamps: true
})

User.beforeCreate((user) => {
  if (user.verification_code) {
    // Establecer expiración en 15 minutos
    user.verification_code_expires = new Date(Date.now() + 15 * 60 * 1000)
  }
})