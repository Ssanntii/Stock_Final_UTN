
// https://sequelize.org/docs/v6/getting-started/
// Mirar opción 3 de la guia de sequelize

import { Sequelize } from "sequelize"
import dotenv from "dotenv"

dotenv.config()
// Crear conexión a bases de datos con SEQUELIZE
export const conn = new Sequelize(
  // Utilizar variables de entorno para la conexion
  process.env.DATABASE,
  process.env.USER,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
  }
)