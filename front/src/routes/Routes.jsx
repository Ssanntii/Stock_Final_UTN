import { Routes, Route } from "react-router"

import Public from '../components/layouts/Public'
import Private from '../components/layouts/Private'

import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"
import ProductForm from "../pages/AddEditProduct"
import NotFoundPage from "../pages/NotFoundPage"

const AppRoutes = () => {
    return (
        <Routes>
             {/* Ruta principal - Lista de productos */}
            <Route path="/" element={<Home />} />
            <Route element={<Public />} path="/auth">
                <Route index element={<Login />} />
                <Route path="register" element={<Register />} />
            </Route>

            {/* Ruta para crear/modificar productos */}
            <Route 
                path="/product" 
                element={<ProductForm />} 
            />
            <Route 
                path="/product/:id" 
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