import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore } from '../store/useCartStore'

const CartItem = ({ item }) => {
  const { incrementQuantity, decrementQuantity, removeItem } = useCartStore()

  const formatPrice = (price) => {
    return Number(price).toFixed(2).replace('.', ',')
  }

  const subtotal = item.price * item.quantity

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
      {/* Información del producto */}
      <div className="flex-1">
        <h3 className="font-semibold text-white text-lg mb-1">
          {item.name}
        </h3>
        <p className="text-green-400 font-medium">
          ${formatPrice(item.price)} c/u
        </p>
      </div>

      {/* Controles de cantidad */}
      <div className="flex items-center gap-3">
        {/* Botón decrementar */}
        <button
          onClick={() => decrementQuantity(item.id)}
          className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors border border-slate-600"
          aria-label="Disminuir cantidad"
        >
          <Minus className="w-4 h-4" />
        </button>

        {/* Cantidad */}
        <span className="w-12 text-center font-semibold text-white text-lg">
          {item.quantity}
        </span>

        {/* Botón incrementar */}
        <button
          onClick={() => incrementQuantity(item.id)}
          disabled={item.quantity >= item.stock}
          className="w-8 h-8 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Aumentar cantidad"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Subtotal y eliminar */}
      <div className="flex items-center gap-4 sm:flex-col sm:items-end justify-between sm:justify-center">
        <div className="text-right">
          <p className="text-xs text-slate-400 mb-1">Subtotal</p>
          <p className="font-bold text-white text-lg">
            ${formatPrice(subtotal)}
          </p>
        </div>

        <button
          onClick={() => removeItem(item.id)}
          className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors border border-red-600/50"
          aria-label="Eliminar del carrito"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Advertencia de stock */}
      {item.quantity >= item.stock && (
        <div className="col-span-full mt-2">
          <p className="text-xs text-yellow-400 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Stock máximo alcanzado ({item.stock} unidades disponibles)
          </p>
        </div>
      )}
    </div>
  )
}

export default CartItem