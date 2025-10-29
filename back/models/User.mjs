import { DataTypes, Model } from 'sequelize'
import { conn } from "../config/db.mjs"

export class User extends Model {}

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
  
  // Auto-referencias para usuarios
  User.belongsTo(models.User, {
    as: 'creator',
    foreignKey: 'created_by',
    constraints: false
  })
  
  User.belongsTo(models.User, {
    as: 'modifier',
    foreignKey: 'modified_by',
    constraints: false
  })
}