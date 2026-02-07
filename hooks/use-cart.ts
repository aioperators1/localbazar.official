
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
    id: string
    name: string
    price: number
    image: string
    quantity: number
    category?: string
}

interface CartStore {
    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (id: string) => void
    decreaseItem: (id: string) => void
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
                const existingItem = currentItems.find((i) => i.id === item.id)

                // Sanitize name on add
                const cleanName = item.name.replace(/Setup Game/gi, '').replace(/- Setup Game/gi, '').trim()
                const cleanItem = { ...item, name: cleanName }

                if (existingItem) {
                    set({
                        items: currentItems.map((i) =>
                            i.id === item.id ? { ...i, quantity: i.quantity + 1, name: cleanName } : i
                        ),
                    })
                } else {
                    set({ items: [...currentItems, { ...cleanItem, quantity: 1 }] })
                }
            },
            decreaseItem: (id) => {
                const currentItems = get().items
                const existingItem = currentItems.find((i) => i.id === id)

                if (existingItem && existingItem.quantity > 1) {
                    set({
                        items: currentItems.map((i) =>
                            i.id === id ? { ...i, quantity: i.quantity - 1 } : i
                        ),
                    })
                } else {
                    set({ items: currentItems.filter((i) => i.id !== id) })
                }
            },
            removeItem: (id) => {
                set({ items: get().items.filter((i) => i.id !== id) })
            },
            clearCart: () => set({ items: [] }),
            totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
            totalPrice: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
        }),
        {
            name: 'electro-cart-storage',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    // Sanitize all items on load
                    state.items = state.items.map(item => ({
                        ...item,
                        name: item.name
                            .replace(/Setup Game/gi, '')
                            .replace(/SetupGame/gi, '')
                            .replace(/Prix Maroc/gi, '')
                            .replace(/- Setup Game/gi, '')
                            .replace(/Gaming Maroc/gi, '')
                            .trim()
                    }));
                }
            }
        }
    )
)
