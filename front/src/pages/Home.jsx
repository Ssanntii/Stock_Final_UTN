import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { ShoppingCart } from 'lucide-react'

import { fetchProducts, deleteProduct } from '../api/apiConfig'
import { useStore } from '../store/useStore'
import { useCartStore } from '../store/useCartStore'

import ProductList from '../components/ProductList'
import Button from '../components/ui/Button'
import UserMenu from '../components/ui/UserMenu'

import logo from '/stock.png'

const Home = () => {
  const { user, isAuthenticated, isAdmin } = useStore()
  const { getTotalItems } = useCartStore()
  const cartItemsCount = getTotalItems()
  
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  const handleDeleteProduct = async (id) => {
    try {
      setError(null)
      
      await deleteProduct(id)
      await loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }
  
  useEffect(() => {
    loadProducts()
  }, [])

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header responsive */}
      <header className="bg-slate-800 shadow-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo y título */}
            <div className="flex items-center gap-3">
              <img src={logo} alt='logo' className="w-12 h-12 shrink-0" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Gestión de Productos
                </h1>
                {/* ✅ Mensaje de bienvenida SIN badge de admin */}
                {isAuthenticated() && (
                  <p className="text-sm text-slate-300 mt-1">
                    Bienvenido, {user.full_name}!
                  </p>
                )}
              </div>
            </div>

            {/* Menú de usuario o botones de auth */}
            <div className="flex items-center gap-3">
              {isAuthenticated() ? (
                <>
                  {/* Botón del carrito (solo para usuarios normales) */}
                  {!isAdmin() && (
                    <Link to="/cart" className="relative">
                      <Button variant="secondary" size="md" className="relative">
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Carrito
                        {cartItemsCount > 0 && (
                          <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-slate-800">
                            {cartItemsCount > 99 ? '99+' : cartItemsCount}
                          </span>
                        )}
                      </Button>
                    </Link>
                  )}
                  <UserMenu />
                </>
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
            isAuthenticated={isAuthenticated()}
            isAdmin={isAdmin()}
          />
        )}
      </main>
    </div>
  )
}

export default Home