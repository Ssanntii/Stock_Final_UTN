import { useState } from 'react'
import { Link } from 'react-router'

import ConfirmModal from './ui/Modal'
import Button from './ui/Button'
import { useCartStore } from '../store/useCartStore'

const ProductRow = ({ product, onDelete, isAuthenticated, isAdmin }) => {
  const [showModal, setShowModal] = useState(false)
  const { addItem, isInCart } = useCartStore()
  
  const formatPrice = (price) => {
    return Number(price).toFixed(2).replace('.', ',')
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

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
        {/* Información del producto */}
        <div className="flex-1 mb-3 sm:mb-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h3 className="font-semibold text-white text-lg">
              {product.name}
            </h3>
            {/* Badge si está en el carrito */}
            {inCart && !isAdmin && (
              <span className="text-xs px-2 py-1 bg-blue-600 text-white rounded-full w-fit">
                En el carrito
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4 mt-2 text-sm">
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
        </div>

        {/* Acciones condicionales según rol */}
        {isAuthenticated && (
          <div className="flex items-center gap-2 ml-auto">
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