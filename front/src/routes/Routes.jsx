import { Routes, Route } from "react-router"

import Public from '../components/layouts/Public'
import ProtectedRoute from '../components/ProtectedRoute'
import AdminRoute from '../components/AdminRoute'

import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"
import VerificationPage from "../pages/VerificationPage" // ✅ NUEVO
import ProductForm from "../pages/AddEditProduct"
import Logs from "../pages/Logs"
import NotFoundPage from "../pages/NotFoundPage"
import Profile from '../pages/Profile'
import CartPage from '../pages/CartPage'

const AppRoutes = () => {
    return (
        <Routes>
            {/* Ruta principal - Lista de productos (pública) */}
            <Route path="/" element={<Home />} />

            {/* Rutas de autenticación */}
            <Route element={<Public />} path="/auth">
                <Route index element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="verify" element={<VerificationPage />} /> {/* ✅ NUEVO */}
            </Route>

            {/* Ruta del carrito (solo para usuarios normales logueados) */}
            <Route 
                path="/cart" 
                element={
                    <ProtectedRoute>
                        <CartPage />
                    </ProtectedRoute>
                } 
            />

            {/* Rutas protegidas SOLO para ADMIN */}
            <Route 
                path="/product" 
                element={
                    <AdminRoute>
                        <ProductForm />
                    </AdminRoute>
                } 
            />
            <Route 
                path="/product/:id" 
                element={
                    <AdminRoute>
                        <ProductForm />
                    </AdminRoute>
                } 
            />

            {/* Ruta de logs SOLO para ADMIN */}
            <Route 
                path="/logs" 
                element={
                    <AdminRoute>
                        <Logs />
                    </AdminRoute>
                } 
            />

            {/* Ruta de perfil para cualquier usuario logueado */}
            <Route 
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
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