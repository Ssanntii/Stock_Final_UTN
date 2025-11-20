import { useState } from 'react'
import { Link } from 'react-router'

import ConfirmModal from './ui/Modal'
import Button from './ui/Button'
import { useCartStore } from '../store/useCartStore'

const ProductRow = ({ product, onDelete, isAuthenticated, isAdmin }) => {
  const [showModal, setShowModal] = useState(false)
  const [imageError, setImageError] = useState(false)
  const { addItem, isInCart } = useCartStore()
  
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

  const handleDeleteClick = () => {
    setShowModal(true)
  }

  const handleConfirmDelete = () => {
    onDelete(product.id)
    setShowModal(false)
  }

  const handleAddToCart = () => {
    addItem(product, 1)
    
    // Feedback visual opcional
    const button = document.activeElement
    if (button) {
      button.classList.add('scale-95')
      setTimeout(() => {
        button.classList.remove('scale-95')
      }, 150)
    }
  }

  const inCart = isInCart(product.id)

  // ✅ Limitar descripción a 200 caracteres
  const truncateDescription = (text, maxLength = 120) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim()
  }

  // ✅ Construir URL de imagen correctamente
  const getImageUrl = () => {
    if (!product.image || product.image === 'notimage.png') {
      return null
    }
    return `${API_URL}/uploads/profiles/products/${product.image}`
  }

  const imageUrl = getImageUrl()

  return (
    <>
      {/* ✅ Componente con estructura mejorada para descripción larga */}
      <div className="flex flex-col sm:flex-row p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors gap-4">
        {/* ✅ Imagen del producto */}
        <div className="w-32 h-32 shrink-0 bg-slate-800 rounded-lg overflow-hidden border border-slate-600">
          {imageUrl && !imageError ? (
            <img 
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-16 h-16 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Información del producto con descripción */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <h3 className="font-semibold text-white text-lg truncate">
              {product.name}
            </h3>
            {/* Badge si está en el carrito */}
            {inCart && !isAdmin && (
              <span className="text-xs px-2 py-1 bg-blue-600 text-white rounded-full w-fit">
                En el carrito
              </span>
            )}
          </div>
          
          {/* ✅ Descripción sin límite de líneas, solo de caracteres */}
          {product.description && (
            <p className="text-slate-300 text-sm mb-3 flex-1">
              {truncateDescription(product.description, 200)}
            </p>
          )}

          {/* Precio y stock + Botones en la parte inferior */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-auto">
            <div className="flex items-center gap-4 text-sm">
              <span className="font-medium text-green-400">
                ${formatPrice(product.price)}
              </span>
              <span className={`font-medium ${
                product.stock > 10 ? 'text-green-400' : 
                product.stock > 0 ? 'text-yellow-400' : 
                'text-red-400'
              }`}>
                Stock: {product.stock}
              </span>
            </div>

            {/* Acciones condicionales según rol */}
            {isAuthenticated && (
              <div className="flex items-center gap-2">
                {/* Si es ADMIN: mostrar botones de Editar y Eliminar */}
                {isAdmin ? (
                  <>
                    <Link to={`/product/${product.id}`}>
                      <Button variant="primary" size="sm">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                      </Button>
                    </Link>
                    
                    <Button variant="danger" size="sm" onClick={handleDeleteClick}>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Eliminar
                    </Button>
                  </>
                ) : (
                  /* Si es USER normal: mostrar botón de Agregar al Carrito */
                  <Button 
                    variant={inCart ? "secondary" : "primary"}
                    size="sm" 
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="transition-transform"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {product.stock === 0 
                      ? 'Sin Stock' 
                      : inCart 
                      ? 'Agregar Más' 
                      : 'Agregar al Carrito'}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de confirmación - solo para ADMIN */}
      {isAuthenticated && isAdmin && (
        <ConfirmModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmDelete}
          title="Eliminar producto"
          message={
            <span>
              ¿Estás seguro de que querés eliminar <strong className="text-white">{product.name}</strong>? Esta acción no se puede deshacer.
            </span>
          }
        />
      )}
    </>
  )
}

export default ProductRow