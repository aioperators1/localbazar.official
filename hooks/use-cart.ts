
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
    id: string
    name: string
    price: number
    image: string
    quantity: number
    category?: string
    size?: string | null
    color?: string | null
}

interface CartStore {
    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (id: string, size?: string | null, color?: string | null) => void
    decreaseItem: (id: string, size?: string | null, color?: string | null) => void
    clearCart: () => void
    totalItems: () => number
    totalPrice: () => number
}

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => {
                const currentItems = get().items
                const existingItem = currentItems.find((i) => 
                    i.id === item.id && 
                    i.size === item.size && 
                    i.color === item.color
                )

                if (existingItem) {
                    set({
                        items: currentItems.map((i) =>
                            (i.id === item.id && i.size === item.size && i.color === item.color)
                                ? { ...i, quantity: i.quantity + (item.quantity || 1) } 
                                : i
                        ),
                    })
                } else {
                    set({ items: [...currentItems, { ...item, quantity: item.quantity || 1 }] })
                }
            },
            decreaseItem: (id, size, color) => {
                const currentItems = get().items
                const existingItem = currentItems.find((i) => 
                    i.id === id && i.size === size && i.color === color
                )

                if (existingItem && existingItem.quantity > 1) {
                    set({
                        items: currentItems.map((i) =>
                            (i.id === id && i.size === size && i.color === color)
                                ? { ...i, quantity: i.quantity - 1 } 
                                : i
                        ),
                    })
                } else {
                    set({ 
                        items: currentItems.filter((i) => 
                            !(i.id === id && i.size === size && i.color === color)
                        ) 
                    })
                }
            },
            removeItem: (id, size, color) => {
                set({ 
                    items: get().items.filter((i) => 
                        !(i.id === id && i.size === size && i.color === color)
                    ) 
                })
            },
            clearCart: () => set({ items: [] }),
            totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
            totalPrice: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
        }),
        {
            name: 'localbazar-cart-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
