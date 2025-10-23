const API_URL = import.meta.env.VITE_URL

// Función helper para manejar respuestas
const handleResponse = async (response) => {
  const data = await response.json()
  
  if (data.error) {
    throw new Error(data.error)
  }
  
  return data
}

// Función helper para manejar errores
const handleError = (error, defaultMessage) => {
  console.error('API Error:', error)
  throw new Error(error.message || defaultMessage)
}

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