import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(persist(
  (set, get) => ({
    user: {
      email: null,
      full_name: null,
      profile_picture: null,
      token: null
    },
    setUser: (newUser) => set({ user: newUser }),
    logout: () => {
      // Resetear el estado
      set({ 
        user: { 
          email: null, 
          full_name: null,
          profile_picture: null,
          token: null 
        } 
      })
      // Limpiar el localStorage manualmente
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