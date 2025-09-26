import { Routes, Route } from "react-router"

import ProductForm from "../pages/AddEditProduct"
import Home from "../pages/Home"

const AppRoutes = () => {
    return (
        <Routes>
            {/* Ruta principal - Lista de productos */}
            <Route 
                path="/" 
                element={<Home />} 
            />
            
            {/* Ruta para crear/modificar productos */}
            <Route 
                path="/producto" 
                element={<ProductForm />} 
            />
            <Route 
                path="/producto/:id" 
                element={<ProductForm />} 
            />
            
            {/* Ruta para errores 404 - Debe ir al final */}
            <Route
                path="/*"
                element={<NotFoundPage />}
            />
        </Routes>
    )
}

export default AppRoutes