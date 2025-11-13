import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(persist(
  (set, get) => ({
    user: {
      email: null,
      fullName: null,
      token: null
    },
    setUser: (newuser) => set({ user: newuser }),
    logout: () => {
      // Resetear el estado
      set({ 
        user: { 
          email: null, 
          fullName: null, 
          token: null 
        } 
      })
      // IMPORTANTE: Limpiar el localStorage manualmente
      localStorage.removeItem('token_login_web')
    },
    isAuthenticated: () => {
      const state = get()
      return state.user.token !== null && state.user.email !== null
    }
  }),
  {
    name: "token_login_web"
  }
))