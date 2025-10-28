const API_URL = import.meta.env.VITE_URL

// Función helper para manejar respuestas
const handleResponse = async (response) => {
  const data = await response.json()
  
  // Si el backend devuelve error: true, lanzamos el mensaje de error
  if (data.error) {
    throw new Error(data.msg || 'Error en la operación')
  }
  
  return data
}

// Función helper para manejar errores
const handleError = (error, defaultMessage) => {
  console.error('API Error:', error)
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
      method: 'DELETE'
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
export const verifyToken = async (token) => {
  try {
    const response = await fetch(`${API_URL}/users/verify-token`, {
      method:  'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    })
    return await handleResponse(response)
  } catch (error) {
    handleError(error, 'Error al verificar el usuario')
  }
}