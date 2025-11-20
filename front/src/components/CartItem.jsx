import { useState, useEffect } from 'react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore } from '../store/useCartStore'

const CartItem = ({ item }) => {
  const { incrementQuantity, decrementQuantity, removeItem, updateQuantity } = useCartStore()
  const [imageError, setImageError] = useState(false)
  const [inputValue, setInputValue] = useState(item.quantity.toString())
  
  // ✅ Sincronizar el input cuando cambia la cantidad desde los botones
  useEffect(() => {
    setInputValue(item.quantity.toString())
  }, [item.quantity])
  
  const API_URL = import.meta.env.VITE_URL

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

  const subtotal = item.price * item.quantity

  // ✅ Manejar cambio en el input
  const handleInputChange = (e) => {
    const value = e.target.value
    
    // Solo permitir números y máximo 3 dígitos
    if (value === '' || /^\d{1,3}$/.test(value)) {
      setInputValue(value)
    }
  }

  // ✅ Manejar cuando el usuario termina de editar (pierde el foco o presiona Enter)
  const handleInputBlur = () => {
    let newQuantity = parseInt(inputValue) || 1
    
    // Validar que no sea menor a 1
    if (newQuantity < 1) {
      newQuantity = 1
    }
    
    // Validar que no supere el stock
    if (newQuantity > item.stock) {
      newQuantity = item.stock
    }
    
    // Actualizar la cantidad en el store
    updateQuantity(item.id, newQuantity)
    setInputValue(newQuantity.toString())
  }

  // ✅ Manejar Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.target.blur() // Dispara el blur que valida
    }
  }

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
        <p className="text-green-400 font-medium mb-1">
          ${formatPrice(item.price)} c/u
        </p>
        {/* ✅ Mostrar stock disponible */}
        <p className="text-slate-400 text-sm">
          Stock disponible: <span className="text-white font-medium">{item.stock}</span>
        </p>
      </div>

      {/* Controles de cantidad mejorados */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-slate-400">Cantidad</span>
        <div className="flex items-center gap-2">
          {/* Botón decrementar */}
          <button
            onClick={() => decrementQuantity(item.id)}
            disabled={item.quantity <= 1}
            className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors border border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Disminuir cantidad"
          >
            <Minus className="w-4 h-4" />
          </button>

          {/* ✅ Input editable para cantidad */}
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyPress={handleKeyPress}
            className="w-16 h-8 text-center font-semibold text-white text-lg bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Cantidad"
          />

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