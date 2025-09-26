import { useState, useEffect } from 'react'

const Home = () => {
  // Estados principales
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  // API Base URL
  const API_URL = 'http://localhost:3000'

  // Obtener productos de la API
  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`${API_URL}/products`)
      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
      } else {
        setProducts(data)
      }
    } catch (err) {
      setError('Error de conexión con el servidor')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  // Crear producto
  const createProduct = async (productData) => {
    try {
      setError(null)
      
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      })
      
      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
        return false
      } else {
        await fetchProducts() // Refrescar lista
        setShowForm(false)
        return true
      }
    } catch (err) {
      setError('Error al crear producto')
      console.error('Error creating product:', err)
      return false
    }
  }

  // Actualizar producto
  const updateProduct = async (id, productData) => {
    try {
      setError(null)
      
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      })
      
      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
        return false
      } else {
        await fetchProducts() // Refrescar lista
        setEditingProduct(null)
        setShowForm(false)
        return true
      }
    } catch (err) {
      setError('Error al actualizar producto')
      console.error('Error updating product:', err)
      return false
    }
  }

  // Eliminar producto
  const deleteProduct = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return
    }

    try {
      setError(null)
      
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
      } else {
        await fetchProducts() // Refrescar lista
      }
    } catch (err) {
      setError('Error al eliminar producto')
      console.error('Error deleting product:', err)
    }
  }

  // Manejar edición
  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  // Cancelar formulario
  const handleCancelForm = () => {
    setShowForm(false)
    setEditingProduct(null)
    setError(null)
  }

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header responsive */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Gestión de Productos
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Administrá tu inventario de productos
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* Mostrar errores */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-gray-600 font-medium">Cargando productos...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Formulario (placeholder por ahora) */}
            {showForm && (
              <div className="mb-8 bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                  </h2>
                  <button
                    onClick={handleCancelForm}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="text-center py-8 text-gray-500">
                  [Aquí irá el componente ProductForm]
                </div>
              </div>
            )}

            {/* Lista de productos */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              
              {/* Stats responsive */}
              <div className="bg-gray-50 px-4 sm:px-6 py-4 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <p className="text-sm font-medium text-gray-700">
                    Total de productos: <span className="text-blue-600 font-bold">{products.length}</span>
                  </p>
                  {products.length > 0 && (
                    <p className="text-sm text-gray-600">
                      Stock total: <span className="font-semibold">
                        {products.reduce((sum, product) => sum + (product.stock || 0), 0)} unidades
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Productos */}
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos</h3>
                  <p className="text-gray-500 mb-4">Agregá tu primer producto</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Agregar Primer Producto
                  </button>
                </div>
              ) : (
                <div className="p-4 sm:p-6">
                  <div className="text-center py-8 text-gray-500">
                    [Aquí irá el componente ProductList con {products.length} productos]
                  </div>
                  
                  {/* Preview de productos (temporal para testing) */}
                  <div className="mt-4 space-y-2">
                    {products.slice(0, 3).map(product => (
                      <div key={product.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600">${product.price} - Stock: {product.stock}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                    {products.length > 3 && (
                      <p className="text-center text-gray-500 text-sm pt-2">
                        Y {products.length - 3} productos más...
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default Home