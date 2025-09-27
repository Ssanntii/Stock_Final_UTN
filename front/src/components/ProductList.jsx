import { Link } from 'react-router'
import ProductRow from './ProductRow'

const ProductList = ({ products, onDeleteProduct }) => {
  return (
    <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 overflow-hidden">
      
      {/* Header con estadísticas */}
      <div className="bg-slate-700 px-4 sm:px-6 py-4 border-b border-slate-600">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-sm font-medium text-slate-300">
            Total de productos: <span className="text-blue-400 font-bold">{products.length}</span>
          </p>
          {products.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-slate-400">
              <p>
                Stock total: <span className="font-semibold text-slate-300">
                  {products.reduce((sum, product) => sum + (product.stock || 0), 0)} unidades
                </span>
              </p>
              <p>
                Valor total: <span className="font-semibold text-green-400">
                  ${products.reduce((sum, product) => sum + (product.price * product.stock || 0), 0).toFixed(2).replace('.', ',')}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lista de productos o estado vacío */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-lg font-medium text-white mb-2">No hay productos</h3>
          <p className="text-slate-400 mb-4">Agregá tu primer producto al inventario</p>
          <Link
            to="/product"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregá tu primer producto
          </Link>
        </div>
      ) : (
        <div className="p-4 sm:p-6">
          {/* Botón agregar producto cuando hay productos */}
          <div className="mb-6">
            <Link
              to="/product"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Agregar Producto
            </Link>
          </div>

          {/* Lista de productos */}
          <div className="space-y-3">
            {products.map(product => (
              <ProductRow 
                key={product.id} 
                product={product} 
                onDelete={onDeleteProduct}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductList