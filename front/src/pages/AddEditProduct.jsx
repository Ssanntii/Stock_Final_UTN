import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router'

import { fetchProductById, createProduct, updateProduct } from '../api/apiConfig'

import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import UserMenu from '../components/ui/UserMenu'

import logo from '/stock.png'

const ProductForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    image: null
  })
  
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isEditing) {
      loadProduct()
    }
  }, [id, isEditing])

  const loadProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const product = await fetchProductById(id)
      setFormData({
        name: product.name || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '',
        image: null
      })
      
      // Si el producto tiene una imagen, mostrarla en el preview
      if (product.image) {
        setImagePreview(`http://localhost:3000/uploads/profiles/products/${product.image}`)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    
    let processedValue = value
    
    if (name === 'price') {
      processedValue = value
        .replace(/,/g, '.')
        .replace(/[^0-9.]/g, '')
        .replace(/(\..*)\./g, '$1')
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        setError('Por favor selecciona un archivo de imagen válido')
        return
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen no debe superar los 5MB')
        return
      }
      
      setFormData(prev => ({
        ...prev,
        image: file
      }))
      
      // Crear preview de la imagen
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
      
      setError(null)
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }))
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const validateForm = () => {
    const errors = []
    
    if (!formData.name.trim()) {
      errors.push('El nombre es obligatorio')
    }
    
    const priceNum = parseFloat(formData.price)
    if (isNaN(priceNum) || priceNum <= 0) {
      errors.push('El precio debe ser mayor a 0')
    }
    
    const stockNum = parseInt(formData.stock) || 0
    if (stockNum < 0) {
      errors.push('El stock no puede ser negativo')
    }
    
    return errors
  }

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
      // Usar FormData para enviar archivos
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name.trim())
      formDataToSend.append('price', parseFloat(formData.price))
      formDataToSend.append('stock', parseInt(formData.stock) || 0)
      
      // Solo agregar la imagen si se seleccionó una nueva
      if (formData.image) {
        formDataToSend.append('image', formData.image)
      }

      if (isEditing) {
        await updateProduct(id, formDataToSend)
      } else {
        await createProduct(formDataToSend)
      }

      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

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
              <img src={logo} alt='logo' className="w-12 h-12 shrink-0" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
                </h1>
                <p className="text-sm text-slate-300 mt-1">
                  {isEditing ? 'Modificá los datos del producto' : 'Agregá un nuevo producto al inventario'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver
              </Link>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
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

        <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <Input
                label="Nombre del producto"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Laptop HP"
                required
                disabled={submitting}
              />
            </div>

            {/* Campo de imagen */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Imagen del producto
              </label>
              
              <div className="space-y-4">
                {/* Preview de la imagen */}
                {imagePreview && (
                  <div className="relative w-full max-w-xs">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg border-2 border-slate-600"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      disabled={submitting}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
                
                {/* Input de archivo */}
                <div className="flex items-center gap-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={submitting}
                    className="hidden"
                  />
                  <label
                    htmlFor="image"
                    className="cursor-pointer inline-flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {imagePreview ? 'Cambiar imagen' : 'Seleccionar imagen'}
                  </label>
                  
                  {!imagePreview && (
                    <span className="text-sm text-slate-400">
                      Si no seleccionas una imagen, se usará una por defecto
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-slate-400">
                  Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 5MB
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Precio"
                  name="price"
                  type="text"
                  value={formData.price}
                  onChange={handleChange}
                  prefix="$"
                  placeholder="0.00"
                  required
                  disabled={submitting}
                />
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

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                type="submit" 
                variant="primary" 
                size="lg" 
                loading={submitting}
                disabled={submitting}
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