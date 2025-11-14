/**
 * Middleware de validación para productos
 */
export const validateProduct = (req, res, next) => {
    const { name, price, stock } = req.body
    const errors = []

    // Validar nombre
    if (!name) {
        errors.push('El nombre es obligatorio')
    } else if (typeof name !== 'string') {
        errors.push('El nombre debe ser un texto')
    } else if (name.trim().length === 0) {
        errors.push('El nombre no puede estar vacío')
    } else if (name.trim().length > 255) {
        errors.push('El nombre no puede exceder 255 caracteres')
    }

    // Validar precio
    if (price === undefined || price === null) {
        errors.push('El precio es obligatorio')
    } else if (typeof price !== 'number') {
        errors.push('El precio debe ser un número')
    } else if (isNaN(price)) {
        errors.push('El precio debe ser un valor numérico válido')
    } else if (price <= 0) {
        errors.push('El precio debe ser mayor a 0')
    } else if (price > 999999999.99) {
        errors.push('El precio excede el valor máximo permitido')
    }

    // Validar stock
    if (stock === undefined || stock === null) {
        errors.push('El stock es obligatorio')
    } else if (typeof stock !== 'number') {
        errors.push('El stock debe ser un número')
    } else if (!Number.isInteger(stock)) {
        errors.push('El stock debe ser un número entero')
    } else if (stock < 0) {
        errors.push('El stock no puede ser negativo')
    } else if (stock > 2147483647) {
        errors.push('El stock excede el valor máximo permitido')
    }

    // Si hay errores, devolver respuesta
    if (errors.length > 0) {
        return res.status(400).json({
            error: true,
            message: 'Error de validación',
            errors: errors
        })
    }

    // Si todo está bien, continuar
    next()
}

/**
 * Middleware de validación para registro de usuario
 */
export const validateUserRegister = (req, res, next) => {
    const { full_name, email, password, confirmPassword } = req.body
    const errors = []

    // Validar nombre completo
    if (!full_name) {
        errors.push('El nombre completo es obligatorio')
    } else if (typeof full_name !== 'string') {
        errors.push('El nombre debe ser un texto')
    } else if (full_name.trim().length === 0) {
        errors.push('El nombre no puede estar vacío')
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/i.test(full_name)) {
        errors.push('El nombre no puede contener números ni caracteres especiales')
    } else if (full_name.trim().length < 3) {
        errors.push('El nombre debe tener al menos 3 caracteres')
    } else if (full_name.trim().length > 100) {
        errors.push('El nombre no puede exceder 100 caracteres')
    }

    // Validar email
    if (!email) {
        errors.push('El email es obligatorio')
    } else if (typeof email !== 'string') {
        errors.push('El email debe ser un texto')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('El formato del email no es válido')
    } else if (email.length > 255) {
        errors.push('El email no puede exceder 255 caracteres')
    }

    // Validar contraseña
    if (!password) {
        errors.push('La contraseña es obligatoria')
    } else if (typeof password !== 'string') {
        errors.push('La contraseña debe ser un texto')
    } else if (password.length < 6) {
        errors.push('La contraseña debe tener al menos 6 caracteres')
    } else if (password.length > 100) {
        errors.push('La contraseña no puede exceder 100 caracteres')
    }

    // Validar confirmación de contraseña
    if (!confirmPassword) {
        errors.push('La confirmación de contraseña es obligatoria')
    } else if (password !== confirmPassword) {
        errors.push('Las contraseñas no coinciden')
    }

    // Si hay errores, devolver respuesta
    if (errors.length > 0) {
        return res.status(400).json({
            error: true,
            message: 'Error de validación',
            errors: errors
        })
    }

    // Si todo está bien, continuar
    next()
}

/**
 * Middleware de validación para login de usuario
 */
export const validateUserLogin = (req, res, next) => {
    const { email, password } = req.body
    const errors = []

    // Validar email
    if (!email) {
        errors.push('El email es obligatorio')
    } else if (typeof email !== 'string') {
        errors.push('El email debe ser un texto')
    } else if (email.trim().length === 0) {
        errors.push('El email no puede estar vacío')
    }

    // Validar contraseña
    if (!password) {
        errors.push('La contraseña es obligatoria')
    } else if (typeof password !== 'string') {
        errors.push('La contraseña debe ser un texto')
    } else if (password.length === 0) {
        errors.push('La contraseña no puede estar vacía')
    }

    // Si hay errores, devolver respuesta
    if (errors.length > 0) {
        return res.status(400).json({
            error: true,
            message: 'Error de validación',
            errors: errors
        })
    }

    // Si todo está bien, continuar
    next()
}

/**
 * Middleware de validación para parámetros de ID
 */
export const validateId = (req, res, next) => {
    const { id } = req.params
    
    if (!id) {
        return res.status(400).json({
            error: true,
            message: 'El ID es obligatorio'
        })
    }

    const numId = parseInt(id)
    
    if (isNaN(numId) || numId <= 0) {
        return res.status(400).json({
            error: true,
            message: 'El ID debe ser un número válido mayor a 0'
        })
    }

    // Si todo está bien, continuar
    next()
}