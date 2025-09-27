import { Link } from 'react-router'
import { useState } from 'react'
import ConfirmModal from './Modal'
import Button from './Button'

const ProductRow = ({ product, onDelete }) => {
  const [showModal, setShowModal] = useState(false)
  
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

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
        {/* Información del producto */}
        <div className="flex-1 mb-3 sm:mb-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h3 className="font-semibold text-white text-lg">
              {product.name}
            </h3>
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

        {/* Acciones */}
        <div className="flex items-center gap-2 ml-auto">
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
        </div>
      </div>

      {/* Modal de confirmación */}
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
    </>
  )
}

export default ProductRow