const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-white mb-4">
                    Página no encontrada
                </h2>
                <p className="text-white mb-8">
                    La ruta que estás buscando no existe.
                </p>
                <a 
                    href="/" 
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Volver al inicio
                </a>
            </div>
        </div>
    )
}

export default NotFoundPage