const API_URL = import.meta.env.VITE_URL

// ======================================================
// ===============   HELPERS GENERALES   ================
// ======================================================

// Obtener token desde localStorage
const getAuthToken = () => {
  try {
    const stored = localStorage.getItem('token_login_web')
    if (!stored) return null

    const parsed = JSON.parse(stored)
    const token = parsed?.state?.user?.token

    return token ? `Bearer ${token}` : null
  } catch {
    return null
  }
}

// Wrapper mejorado para fetch con mejor manejo de errores
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken()

  const config = {
    method: options.method || 'GET',
    headers: {
      ...(options.body instanceof FormData
        ? {} // Si es FormData NO poner Content-Type
        : { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: token }),
      ...(options.headers || {})
    },
    body:
      options.body instanceof FormData
        ? options.body
        : options.body
        ? JSON.stringify(options.body)
        : undefined
  }

  const response = await fetch(`${API_URL}${endpoint}`, config)

  const contentType = response.headers.get('content-type')

  // Respuesta no-JSON
  if (!contentType?.includes('application/json')) {
    throw new Error(`Error HTTP ${response.status}: ${response.statusText}`)
  }

  const data = await response.json()

  // Mejorado: Incluir data completa en el error para acceso a needsVerification, etc.
  if (!response.ok || data.error) {
    const error = new Error(
      data.msg ||
      data.message ||
      data.error ||
      `Error ${response.status}`
    )
    error.response = { data, status: response.status }
    
    // Si es un array de errores, unirlos
    if (Array.isArray(data.errors)) {
      error.message = data.errors.join(', ')
    }
    
    throw error
  }

  return data
}

// ======================================================
// ====================  PRODUCTOS  =====================
// ======================================================

export const fetchProducts = () => apiRequest('/products')

export const fetchProductById = (id) =>
  apiRequest(`/products/${id}`)

export const createProduct = (productData) =>
  apiRequest('/products', {
    method: 'POST',
    body: productData   // puede ser JSON o FormData
  })

export const updateProduct = (id, productData) =>
  apiRequest(`/products/${id}`, {
    method: 'PUT',
    body: productData
  })

export const deleteProduct = (id) =>
  apiRequest(`/products/${id}`, {
    method: 'DELETE'
  })

// ======================================================
// =====================  USUARIOS  =====================
// ======================================================

export const updateUserProfile = (userData) =>
  apiRequest('/users/update', {
    method: 'PUT',
    body: userData
  })

export const registerUser = (userData) =>
  apiRequest('/users/register', {
    method: 'POST',
    body: userData
  })

export const loginUser = async (credentials) => {
  const data = await apiRequest('/users/login', {
    method: 'POST',
    body: credentials
  })
  return data.user // respuesta simplificada
}

export const verifyToken = () =>
  apiRequest('/users/verify-token')

// ✅ Funciones para verificación de email
export const verifyEmail = (email, code) =>
  apiRequest('/users/verify-email', {
    method: 'POST',
    body: { email, verification_code: code }
  })

export const resendVerificationCode = (email) =>
  apiRequest('/users/resend-verification', {
    method: 'POST',
    body: { email }
  })

// ======================================================
// ======================= LOGS =========================
// ======================================================

export const fetchProductLogs = () =>
  apiRequest('/products/logs')

// ======================================================
// ==================== CHECKOUT ========================
// ======================================================

/**
 * ✅ Procesar compra
 * @param {Array} items - Array de { id, quantity }
 * @returns {Promise} Detalles de la orden
 */
export const processCheckout = (items) =>
  apiRequest('/checkout', {
    method: 'POST',
    body: { items }
  })