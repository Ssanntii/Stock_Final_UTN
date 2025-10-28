import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'

import { fetchProducts, deleteProduct } from '../api/apiConfig'
import { useStore } from '../store/useStore'

import ProductList from '../components/ProductList'
import Button from '../components/ui/Button'

import logo from '/stock.png'

const Home = () => {
  const navigate = useNavigate()
  const { user, logout } = useStore()
  const isAuthenticated = user.token !== null && user.email !== null

  // Estados principales
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Obtener productos
  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await fetchProducts()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Eliminar producto
  const handleDeleteProduct = async (id) => {
    try {
      setError(null)
      
      await deleteProduct(id)
      await loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  // Cerrar sesión
  const handleLogout = () => {
    logout()
    setError(null)
  }
  
  // Cargar productos al montar el componente
  useEffect(() => {
    loadProducts()
  }, [])

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header responsive */}
      <header className="bg-slate-800 shadow-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt='logo' className="w-12 h-12 flex-shrink-0" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Gestión de Productos
                </h1>
                <p className="text-sm text-slate-300 mt-1">
                  {isAuthenticated 
                    ? `Bienvenido, ${user.fullName}!` 
                    : 'Administrá tu inventario de productos'}
                </p>
              </div>
            </div>

            {/* Botones de autenticación o logout */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Button 
                  variant="danger" 
                  size="md"
                  onClick={handleLogout}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Cerrar Sesión
                </Button>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="secondary" size="md">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link to="/auth/register">
                    <Button variant="primary" size="md">
                      Registrarse
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* Mostrar errores */}
        {error && (
          <div className="mb-6 bg-red-900/50 border border-red-700 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-300 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              <span className="text-slate-300 font-medium">Cargando productos...</span>
            </div>
          </div>
        ) : (
          <ProductList 
            products={products} 
            onDeleteProduct={handleDeleteProduct}
            isAuthenticated={isAuthenticated}
          />
        )}
      </main>
    </div>
  )
}

export default Home