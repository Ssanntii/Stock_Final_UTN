import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(persist(
  (set, get) => ({
    // Estado inicial
    items: [],

    // Agregar producto al carrito
    addItem: (product, quantity = 1) => {
      const items = get().items
      const existingItem = items.find(item => item.id === product.id)

      if (existingItem) {
        // Si ya existe, aumentar la cantidad
        set({
          items: items.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        })
      } else {
        // Si no existe, agregarlo
        set({
          items: [...items, { ...product, quantity }]
        })
      }
    },

    // Eliminar producto del carrito
    removeItem: (productId) => {
      set({
        items: get().items.filter(item => item.id !== productId)
      })
    },

    // Actualizar cantidad de un producto
    updateQuantity: (productId, quantity) => {
      if (quantity <= 0) {
        get().removeItem(productId)
        return
      }

      set({
        items: get().items.map(item =>
          item.id === productId
            ? { ...item, quantity }
            : item
        )
      })
    },

    // Incrementar cantidad
    incrementQuantity: (productId) => {
      set({
        items: get().items.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      })
    },

    // Decrementar cantidad
    decrementQuantity: (productId) => {
      const item = get().items.find(item => item.id === productId)
      
      if (item && item.quantity > 1) {
        set({
          items: get().items.map(item =>
            item.id === productId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
        })
      } else {
        get().removeItem(productId)
      }
    },

    // Limpiar todo el carrito
    clearCart: () => {
      set({ items: [] })
    },

    // Obtener cantidad total de items
    getTotalItems: () => {
      return get().items.reduce((total, item) => total + item.quantity, 0)
    },

    // Obtener precio total
    getTotalPrice: () => {
      return get().items.reduce(
        (total, item) => total + (item.price * item.quantity),
        0
      )
    },

    // Verificar si un producto está en el carrito
    isInCart: (productId) => {
      return get().items.some(item => item.id === productId)
    },

    // Obtener cantidad de un producto específico
    getItemQuantity: (productId) => {
      const item = get().items.find(item => item.id === productId)
      return item ? item.quantity : 0
    }
  }),
  {
    name: 'shopping-cart' // Nombre en localStorage
  }
))