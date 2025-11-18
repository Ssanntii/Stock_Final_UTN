import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(persist(
  (set, get) => ({
    user: {
      email: null,
      full_name: null,
      profile_picture: null,
      token: null,
      role: null // ⭐ NUEVO: rol del usuario
    },
    setUser: (newUser) => set({ user: newUser }),
    logout: () => {
      set({ 
        user: { 
          email: null, 
          full_name: null,
          profile_picture: null,
          token: null,
          role: null // ⭐ Resetear también el rol
        } 
      })
      localStorage.removeItem('token_login_web')
    },
    isAuthenticated: () => {
      const state = get()
      return state.user.token !== null && state.user.email !== null
    },
    // ⭐ NUEVO: Método para verificar si es admin
    isAdmin: () => {
      const state = get()
      return state.user.role === 'admin'
    }
  }),
  {
    name: "token_login_web"
  }
))