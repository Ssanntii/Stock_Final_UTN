import { Routes, Route } from "react-router"

import Public from '../components/layouts/Public'
import ProtectedRoute from '../components/ProtectedRoute'

import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"
import ProductForm from "../pages/AddEditProduct"
import Logs from "../pages/Logs"
import NotFoundPage from "../pages/NotFoundPage"

const AppRoutes = () => {
    return (
        <Routes>
            {/* Ruta principal - Lista de productos */}
            <Route path="/" element={<Home />} />

            {/* Rutas de autenticación */}
            <Route element={<Public />} path="/auth">
                <Route index element={<Login />} />
                <Route path="register" element={<Register />} />
            </Route>

            {/* Rutas protegidas para crear/modificar productos */}
            <Route 
                path="/product" 
                element={
                    <ProtectedRoute>
                        <ProductForm />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/product/:id" 
                element={
                    <ProtectedRoute>
                        <ProductForm />
                    </ProtectedRoute>
                } 
            />

            {/* Ruta protegida para ver logs */}
            <Route 
                path="/logs" 
                element={
                    <ProtectedRoute>
                        <Logs />
                    </ProtectedRoute>
                } 
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