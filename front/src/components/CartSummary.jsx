import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '../store/useCartStore'

const CartSummary = ({ onCheckout, loading = false }) => {
  const { getTotalItems, getTotalPrice } = useCartStore()

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

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


  return (
    <div className="bg-slate-700 rounded-xl p-6 sticky top-6 border border-slate-600">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <ShoppingBag className="w-6 h-6" />
        Resumen del Pedido
      </h2>

      {/* Detalles del resumen */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-slate-300">
          <span>Productos ({totalItems})</span>
          <span className="font-semibold">${formatPrice(totalPrice)}</span>
        </div>

        <div className="flex justify-between text-slate-300">
          <span>Envío</span>
          <span className="text-green-400 font-semibold">GRATIS</span>
        </div>

        <div className="border-t border-slate-600 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-white">Total</span>
            <span className="text-2xl font-bold text-green-400">
              ${formatPrice(totalPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Botón de finalizar compra */}
      <button
        onClick={onCheckout}
        disabled={totalItems === 0 || loading}
        className="w-full bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Procesando...</span>
          </>
        ) : (
          <>
            <ShoppingBag className="w-5 h-5" />
            Finalizar Compra
          </>
        )}
      </button>

      {/* Información adicional */}
      <div className="mt-6 pt-6 border-t border-slate-600">
        <div className="space-y-3 text-sm text-slate-400">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Envío gratis en todas las compras</span>
          </div>
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Devoluciones en 30 días</span>
          </div>
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Pago 100% seguro</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartSummary