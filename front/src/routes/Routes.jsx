import { Routes, Route } from "react-router"

const AppRoutes = () => {
    return (
        <Routes>
            <Route 
                path={"/producto/:id"} 
                element={<Contenedor />} 
            />
            <Route 
                path="/" 
                element={<Home />} 
            />
        </Routes>
    )
}

export default AppRoutes