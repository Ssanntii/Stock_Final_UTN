import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowLeft, ShoppingCart, Trash2, CheckCircle2 } from 'lucide-react'
import { useCartStore } from '../store/useCartStore'
import { useStore } from '../store/useStore'
import { processCheckout } from '../api/apiConfig' // ✅ Usar apiConfig
import CartItem from '../components/CartItem'
import CartSummary from '../components/CartSummary'
import ConfirmModal from '../components/ui/Modal' // ✅ Importar modal
import UserMenu from '../components/ui/UserMenu' // ✅ Importar UserMenu
import logo from '/stock.png'

const CartPage = () => {
  const { items, clearCart, getTotalItems } = useCartStore()
  const { user } = useStore()
  const navigate = useNavigate()
  const totalItems = getTotalItems()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [orderDetails, setOrderDetails] = useState(null)
  const [showClearModal, setShowClearModal] = useState(false) // ✅ Estado del modal

  const handleCheckout = async () => {
    setLoading(true)
    setError(null)

    try {
      // Preparar items para el backend
      const orderItems = items.map(item => ({
        id: item.id,
        quantity: item.quantity
      }))

      // ✅ Usar apiConfig para el checkout
      const data = await processCheckout(orderItems)

      // Compra exitosa
      setSuccess(true)
      setOrderDetails(data.order)

      // Limpiar carrito después de la compra
      clearCart()

      // Scroll al top para ver el mensaje
      window.scrollTo({ top: 0, behavior: 'smooth' })

    } catch (err) {
      console.error('Error en checkout:', err)
      setError(err.message || 'Error al procesar la compra')
    } finally {
      setLoading(false)
    }
  }
  
  const formatPrice = (price) => {
    // Convertir a número con 2 decimales
    const num = Number(price).toFixed(2)
    // Separar parte entera y decimal
    const [integer, decimal] = num.split('.')
    // Agregar puntos como separador de miles
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    // Retornar con coma para decimales
    return `${formattedInteger},${decimal}`
  }

  // ✅ Usar modal para confirmar limpieza
  const handleClearCartClick = () => {
    setShowClearModal(true)
  }

  const handleConfirmClear = () => {
    clearCart()
    setShowClearModal(false)
  }

  // Si la compra fue exitosa, mostrar confirmación
  if (success && orderDetails) {
    return (
      <div className="min-h-screen bg-slate-900">
        {/* Header */}
        <header className="bg-slate-800 shadow-sm border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3 group">
                <img src={logo} alt='logo' className="w-10 h-10 shrink-0" />
                <span className="text-lg font-semibold text-white">Tu Compra | {orderDetails.orderNumber}</span>
              </Link>
              {/* ✅ UserMenu también en pantalla de éxito */}
              <UserMenu />
            </div>
          </div>
        </header>

        {/* Contenido de éxito */}
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8 text-center">
            {/* Icono de éxito */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border-2 border-green-500/30">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
            </div>

            {/* Título */}
            <h1 className="text-3xl font-bold text-white mb-2">¡Compra Realizada!</h1>
            <p className="text-slate-400 mb-6">Tu orden ha sido procesada exitosamente</p>

            {/* Detalles de la orden */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 mb-6 text-left">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-slate-400">Número de Orden</p>
                  <p className="text-white font-semibold">{orderDetails.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Fecha</p>
                  <p className="text-white font-semibold">{orderDetails.date}</p>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <p className="text-sm text-slate-400 mb-2">Productos ({orderDetails.items.length})</p>
                <div className="space-y-2">
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-slate-300">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="text-green-400 font-medium">
                        ${formatPrice(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-700 mt-4 pt-4 flex justify-between">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-2xl text-green-400 font-bold">
                    ${formatPrice(orderDetails.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Mensaje adicional */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 mb-6">
              <p className="text-blue-300 text-sm">
                📧 Te hemos enviado un email de confirmación con los detalles de tu compra a{' '}
                <strong>{user.email}</strong>
              </p>
            </div>

            {/* Botón para volver */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a Productos
            </Link>
          </div>
        </main>
      </div>
    )
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
              <span className="text-lg font-semibold text-white">Carrito</span>
            </Link>

            {/* ✅ UserMenu en el header */}
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 bg-red-900/50 border border-red-700 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

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
              onClick={handleClearCartClick}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors border border-red-600/50 disabled:opacity-50"
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
                Agregá productos para comenzar tu compra
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
              <CartSummary 
                onCheckout={handleCheckout} 
                loading={loading}
              />
            </div>
          </div>
        )}
      </main>

      {/* ✅ Modal de confirmación para vaciar carrito */}
      <ConfirmModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleConfirmClear}
        title="Vaciar carrito"
        message="¿Estás seguro de que querés eliminar todos los productos del carrito? Esta acción no se puede deshacer."
        confirmText="Sí, vaciar"
        cancelText="Cancelar"
      />
    </div>
  )
}

export default CartPage