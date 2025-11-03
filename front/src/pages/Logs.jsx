import { useState, useEffect } from 'react'
import { Link } from 'react-router'

import { fetchProductLogs } from '../api/apiConfig'
import { useStore } from '../store/useStore'

import Button from '../components/ui/Button'

import logo from '/stock.png'

const Logs = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [search, setSearch] = useState('')

    const loadLogs = async () => {
            try {
                  setLoading(true)
                  setError(null)
                  
                  const data = await fetchProductLogs()
                  setProducts(data)
                } catch (err) {
                  setError(err.message)
                } finally {
                  setLoading(false)
                }
        }

    useEffect(() => {
        loadLogs()
    }, [])

    const formatDate = (date) => {
        return new Date(date).toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const filteredProducts = products.filter(p => {
        if (!search) return true
        const searchLower = search.toLowerCase()
        const creatorName = p.createdBy?.name?.toLowerCase() || ''
        const modifierName = p.modifiedBy?.name?.toLowerCase() || ''
        return creatorName.includes(searchLower) || modifierName.includes(searchLower)
    })

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Header */}
            <header className="bg-slate-800 border-b border-slate-700">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src={logo} alt='logo' className="w-12 h-12" />
                            <div>
                                <h1 className="text-2xl font-bold text-white">Historial de Productos</h1>
                                <p className="text-sm text-slate-300">Registro de creación y modificación</p>
                            </div>
                        </div>
                        <Link to="/">
                            <Button variant="secondary" size="md">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Volver
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Contenido */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                
                {/* Error */}
                {error && (
                    <div className="mb-6 bg-red-900/50 border border-red-700 rounded-lg p-4">
                        <p className="text-red-300">{error}</p>
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                    </div>
                ) : (
                    <>
                        {/* Buscador */}
                        <div className="mb-6">
                            <input
                                type="text"
                                placeholder="Buscar por usuario..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full max-w-md px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {search && (
                                <p className="mt-2 text-sm text-slate-300">
                                    Mostrando {filteredProducts.length} de {products.length} productos
                                </p>
                            )}
                        </div>

                        {/* Tabla */}
                        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                            {filteredProducts.length === 0 ? (
                                <p className="text-center py-12 text-slate-400">
                                    {search ? 'No se encontraron productos' : 'No hay productos registrados'}
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-slate-700">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-200">Producto</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-200">Precio</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-200">Stock</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-200">Creado Por</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-200">Creado El</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-200">Modificado Por</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-200">Última Modificación</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-700">
                                            {filteredProducts.map(product => (
                                                <tr key={product.id} className="hover:bg-slate-700/50">
                                                    <td className="px-4 py-3 text-sm text-white font-medium">{product.name}</td>
                                                    <td className="px-4 py-3 text-sm text-slate-300">${parseFloat(product.price).toFixed(2)}</td>
                                                    <td className="px-4 py-3 text-sm text-slate-300">{product.stock}</td>
                                                    <td className="px-4 py-3 text-sm text-slate-300">
                                                        {product.createdBy?.name || 'N/A'}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-300">
                                                        {formatDate(product.createdAt)}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-300">
                                                        {product.modifiedBy?.name || '-'}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-300">
                                                        {product.updatedAt !== product.createdAt 
                                                            ? formatDate(product.updatedAt) 
                                                            : '-'
                                                        }
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    )
}

export default Logs