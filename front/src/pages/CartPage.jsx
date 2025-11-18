 import { Link } from 'react-router'
import { ArrowLeft, ShoppingCart, Trash2 } from 'lucide-react'
import { useCartStore } from '../store/useCartStore'
import { useStore } from '../store/useStore'
import CartItem from '../components/CartItem'
import CartSummary from '../components/CartSummary'
import logo from '/stock.png'

const CartPage = () => {
  const { items, clearCart, getTotalItems } = useCartStore()
  const { user } = useStore()
  const totalItems = getTotalItems()

  const handleCheckout = () => {
    // TODO: Implementar lógica de checkout
    alert('Funcionalidad de pago en desarrollo')
    console.log('Procesando compra:', items)
  }

  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que querés vaciar el carrito?')) {
      clearCart()
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 shadow-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              <img src={logo} alt='logo' className="w-10 h-10 shrink-0" />
              <span className="text-lg font-semibold text-white">Volver a Productos</span>
            </Link>

            {user.full_name && (
              <p className="text-sm text-slate-300">
                {user.full_name}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <ShoppingCart className="w-8 h-8" />
              Mi Carrito
            </h1>
            <p className="text-slate-400">
              {totalItems > 0 
                ? `Tienes ${totalItems} ${totalItems === 1 ? 'producto' : 'productos'} en tu carrito`
                : 'Tu carrito está vacío'}
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={handleClearCart}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors border border-red-600/50"
            >
              <Trash2 className="w-4 h-4" />
              Vaciar Carrito
            </button>
          )}
        </div>

        {/* Carrito vacío */}
        {items.length === 0 ? (
          <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-12 h-12 text-slate-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Tu carrito está vacío
              </h2>
              <p className="text-slate-400 mb-6">
                Agrega productos para comenzar tu compra
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Ver Productos
              </Link>
            </div>
          </div>
        ) : (
          /* Carrito con productos */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de productos */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Resumen del pedido */}
            <div className="lg:col-span-1">
              <CartSummary onCheckout={handleCheckout} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default CartPage