
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface WishlistItem {
    id: string
    name: string
    price: number
    image: string
    slug: string
    category?: string
}

interface WishlistStore {
    items: WishlistItem[]
    addItem: (item: WishlistItem) => void
    removeItem: (id: string) => void
    clearWishlist: () => void
    isInWishlist: (id: string) => boolean
    toggleItem: (item: WishlistItem) => void
}

export const useWishlist = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => {
                const currentItems = get().items
                const existingItem = currentItems.find((i) => i.id === item.id)

                if (!existingItem) {
                    set({ items: [...currentItems, item] })
                }
            },
            removeItem: (id) => {
                set({ items: get().items.filter((i) => i.id !== id) })
            },
            clearWishlist: () => set({ items: [] }),
            isInWishlist: (id) => get().items.some((i) => i.id === id),
            toggleItem: (item) => {
                if (get().isInWishlist(item.id)) {
                    get().removeItem(item.id)
                } else {
                    get().addItem(item)
                }
            }
        }),
        {
            name: 'localbazar-wishlist-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
