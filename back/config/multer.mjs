import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuración de almacenamiento para fotos de perfil
const storageProfile = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/profiles'))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    cb(null, `profile-${uniqueSuffix}${ext}`)
  }
})

// Configuración de almacenamiento para imágenes de productos
const storageProduct = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/profiles/products'))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    cb(null, `product-${uniqueSuffix}${ext}`)
  }
})

// Filtro de archivos (solo imágenes)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (extname && mimetype) {
    cb(null, true)
  } else {
    cb(new Error('Solo se permiten archivos de imagen (jpg, jpeg, png, gif, webp)'))
  }
}

// Configuración de multer para fotos de perfil
export const uploadProfilePicture = multer({
  storage: storageProfile,
  limits: {
    fileSize: 5 * 1024 * 1024 // Límite de 5MB
  },
  fileFilter: fileFilter
})

// Configuración de multer para imágenes de productos
export const uploadProductImage = multer({
  storage: storageProduct,
  limits: {
    fileSize: 5 * 1024 * 1024 // Límite de 5MB
  },
  fileFilter: fileFilter
})