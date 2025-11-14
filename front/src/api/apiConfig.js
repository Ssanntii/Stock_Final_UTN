const API_URL = import.meta.env.VITE_URL

// ========== HELPERS ==========

// Función helper para obtener el token del store
const getAuthToken = () => {
  const stored = localStorage.getItem('token_login_web')
  if (!stored) return null
  
  try {
    const parsed = JSON.parse(stored)
    const token = parsed?.state?.user?.token
    return token ? `Bearer ${token}` : null
  } catch (error) {
    return null
  }
}

// Función helper para manejar respuestas - MEJORADO
const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type")
  
  // Si no es JSON, error genérico
  if (!contentType?.includes("application/json")) {
    throw new Error(`Error HTTP ${response.status}: ${response.statusText}`)
  }
  
  const data = await response.json()
  
  // Si hay error en la respuesta O status no OK
  if (data.error || !response.ok) {
    // Si hay múltiples errores (del middleware de validación)
    if (data.errors && Array.isArray(data.errors)) {
      throw new Error(data.errors.join(', '))
    }
    // Si hay un solo mensaje de error
    throw new Error(data.msg || data.message || data.error || `Error ${response.status}`)
  }
  
  return data
}

// Función helper para manejar errores
const handleError = (error, defaultMessage) => {
  throw new Error(error.message || defaultMessage)
}

// ========== PRODUCTOS ==========

// Obtener todos los productos
export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`)
    return await handleResponse(response)
  } catch (error) {
    handleError(error, 'Error de conexión con el servidor')
  }
}

// Obtener un producto por ID
export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`)
    return await handleResponse(response)
  } catch (error) {
    handleError(error, 'Error al obtener el producto')
  }
}

// Crear un nuevo producto
export const createProduct = async (productData) => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      body: JSON.stringify(productData)
    })
    return await handleResponse(response)
  } catch (error) {
    handleError(error, 'Error al crear producto')
  }
}

// Actualizar un producto existente
export const updateProduct = async (id, productData) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      body: JSON.stringify(productData)
    })
    return await handleResponse(response)
  } catch (error) {
    handleError(error, 'Error al actualizar producto')
  }
}

// Eliminar un producto
export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': getAuthToken()
      }
    })
    return await handleResponse(response)
  } catch (error) {
    handleError(error, 'Error al eliminar producto')
  }
}

// ========== USUARIOS ==========

// Registrar un usuario
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    })
    return await handleResponse(response)
  } catch (error) {
    console.log(error)
    handleError(error, 'Error al registrar el usuario')
  }
}

// Iniciar sesión de un usuario
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
    const data = await handleResponse(response)
    
    // Devolvemos solo el objeto user que viene en la respuesta
    return data.user
  } catch (error) {
    handleError(error, 'Error al iniciar sesión')
  }
}

// Verificar token
export const verifyToken = async () => {
  try {
    const response = await fetch(`${API_URL}/users/verify-token`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      }
    })
    return await handleResponse(response)
  } catch (error) {
    handleError(error, 'Error al verificar el usuario')
  }
}

// ========== LOGS ==========

// Obtener logs de productos
export const fetchProductLogs = async () => {
  try{
    const response = await fetch(`${API_URL}/products/logs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      }
    })
    return await handleResponse(response)
  } catch (error) {
    handleError(error, 'Error al obtener los logs de productos')
  }
}