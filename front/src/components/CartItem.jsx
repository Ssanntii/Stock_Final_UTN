import { useState } from 'react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore } from '../store/useCartStore'

const CartItem = ({ item }) => {
  const { incrementQuantity, decrementQuantity, removeItem } = useCartStore()
  const [imageError, setImageError] = useState(false)
  
  const API_URL = import.meta.env.VITE_URL

  const formatPrice = (price) => {
    return Number(price).toFixed(2).replace('.', ',')
  }

  const subtotal = item.price * item.quantity

  // ✅ Construir URL de imagen correctamente
  const getImageUrl = () => {
    if (!item.image || item.image === 'notimage.png') {
      return null
    }
    return `${API_URL}/uploads/profiles/products/${item.image}`
  }

  const imageUrl = getImageUrl()

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
      
      {/* ✅ Imagen del producto */}
      <div className="w-24 h-24 shrink-0 bg-slate-800 rounded-lg overflow-hidden border border-slate-600">
        {imageUrl && !imageError ? (
          <img 
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Información del producto */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white text-lg mb-1 truncate">
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