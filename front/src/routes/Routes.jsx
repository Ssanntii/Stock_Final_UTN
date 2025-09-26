import { Routes, Route } from "react-router"

import Home from "../pages/Home"
import ProductForm from "../pages/AddEditProduct"
import NotFoundPage from "../pages/NotFoundPage"

const AppRoutes = () => {
    return (
        <Routes>
            {/* Ruta para crear/modificar productos */}
            <Route 
                path="/product/:id" 
                element={<ProductForm />} 
            />
            <Route 
                path="/product" 
                element={<ProductForm />} 
            />
            {/* Ruta principal - Lista de productos */}
            <Route 
                path="/" 
                element={<Home />} 
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