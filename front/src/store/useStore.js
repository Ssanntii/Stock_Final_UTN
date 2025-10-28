import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(persist(
  (set) => ({
    user: {
      email: null,
      full_name: null,
      token: null
    },
    setUser: (newuser) => set({ user: newuser }),
    logout: () => set({ 
      user: { 
        email: null, 
        full_name: null, 
        token: null 
      } 
    }),
    isAuthenticated: () => {
      const state = useStore.getState()
      return state.user.token !== null && state.user.email !== null
    }
  }),
  {
    name: "token_login_web"
  }
))