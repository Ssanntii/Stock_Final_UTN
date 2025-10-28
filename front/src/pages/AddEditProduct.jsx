import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router'

import { fetchProductById, createProduct, updateProduct } from '../api/apiConfig'

import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

import logo from '/stock.png'

const ProductForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  // Estados del formulario
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: ''
  })
  
  // Estados de la UI
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Cargar producto si estamos editando
  useEffect(() => {
    if (isEditing) {
      loadProduct()
    }
  }, [id])

  const loadProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const product = await fetchProductById(id)
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '',
        category: product.category || ''
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target
    
    let processedValue = value
    if (name === 'price' && typeof value === 'string') {
      // Reemplazar todas las comas por puntos y limpiar caracteres extra
      processedValue = value
        .replace(/,/g, '.') // Reemplazar todas las comas
        .replace(/[^0-9.]/g, '') // Solo permitir números y puntos
        .replace(/(\..*)\./g, '$1') // Eliminar puntos duplicados
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }))
  }

  // Validar formulario
  const validateForm = () => {
    const errors = []
    
    if (!formData.name.trim()) {
      errors.push('El nombre es obligatorio')
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.push('El precio debe ser mayor a 0')
    }
    
    // Validación más robusta del stock
    if (formData.stock !== '' && formData.stock !== undefined) {
      const stockNum = parseInt(formData.stock)
      if (isNaN(stockNum) || stockNum < 0) {
        errors.push('El stock debe ser 0 o un número positivo')
      }
    }
    return errors
  }

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '))
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      // Asegurar valores correctos ANTES de enviar al backend
      const stockValue = formData.stock === '' || formData.stock === null || formData.stock === undefined 
        ? 0 
        : parseInt(formData.stock)
      
      const productData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        stock: isNaN(stockValue) || stockValue < 0 ? 0 : stockValue
      }

      if (isEditing) {
        await updateProduct(id, productData)
      } else {
        await createProduct(productData)
      }

      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Mostrar loading si estamos cargando un producto para editar
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <span className="text-slate-300 font-medium">Cargando producto...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 shadow-sm border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt='logo' className="w-12 h-12 flex-shrink-0" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
                </h1>
                <p className="text-sm text-slate-300 mt-1">
                  {isEditing ? 'Modificá los datos del producto' : 'Agregá un nuevo producto al inventario'}
                </p>
              </div>
            </div>
            
            {/* Botón volver */}
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver
            </Link>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* Mostrar errores */}
        {error && (
          <div className="mb-6 bg-red-900/50 border border-red-700 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-300 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Formulario */}
        <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Nombre */}
            <div>
              <Input
                label="Nombre del producto"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre del producto..."
                required
                disabled={submitting}
              />
            </div>

            {/* Precio y Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
                  <Input
                    label="Precio"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    prefix="$"
                    placeholder="0,00"
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-slate-300 mb-2">
                  Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border border-slate-600 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-slate-400"
                  placeholder="0"
                  disabled={submitting}
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                type="submit" 
                variant="primary" 
                size="lg" 
                loading={submitting}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isEditing ? 'Actualizando...' : 'Guardando...'}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {isEditing ? 'Actualizar Producto' : 'Guardar Producto'}
                  </>
                )}
              </Button>
              
              <Link
                to="/"
                className="flex-1 sm:flex-none inline-flex justify-center items-center px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium rounded-lg transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancelar
              </Link>
            </div>

            {/* Nota sobre campos obligatorios */}
            <p className="text-sm text-slate-400 pt-2">
              Los campos marcados con <span className="text-red-400 font-semibold">*</span> son obligatorios
            </p>
          </form>
        </div>
      </main>
    </div>
  )
}

export default ProductForm