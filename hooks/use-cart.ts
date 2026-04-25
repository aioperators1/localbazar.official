
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
    voucher: {
        id: string
        code: string
        type: string
        value: number
    } | null
    addItem: (item: CartItem) => void
    removeItem: (id: string, size?: string | null, color?: string | null) => void
    decreaseItem: (id: string, size?: string | null, color?: string | null) => void
    clearCart: () => void
    setVoucher: (voucher: CartStore['voucher']) => void
    totalItems: () => number
    totalPrice: () => number
    discountAmount: () => number
}

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            voucher: null,
            addItem: (item: CartItem) => {
                const currentItems = get().items
                // Normalize size/color to null if falsy to prevent key mismatches
                const targetSize = item.size ?? null;
                const targetColor = item.color ?? null;

                const existingItem = currentItems.find((i: CartItem) => 
                    i.id === item.id && 
                    i.size === targetSize && 
                    i.color === targetColor
                )

                if (existingItem) {
                    set({
                        items: currentItems.map((i: CartItem) =>
                            (i.id === item.id && i.size === targetSize && i.color === targetColor)
                                ? { ...i, quantity: i.quantity + (item.quantity || 1) } 
                                : i
                        ),
                    })
                } else {
                    set({ items: [...currentItems, { ...item, size: targetSize, color: targetColor, quantity: item.quantity || 1 }] })
                }
            },
            decreaseItem: (id, size, color) => {
                const currentItems = get().items
                const existingItem = currentItems.find((i: CartItem) => 
                    i.id === id && i.size === size && i.color === color
                )

                if (existingItem && existingItem.quantity > 1) {
                    set({
                        items: currentItems.map((i: CartItem) =>
                            (i.id === id && i.size === size && i.color === color)
                                ? { ...i, quantity: i.quantity - 1 } 
                                : i
                        ),
                    })
                } else {
                    set({ 
                        items: currentItems.filter((i: CartItem) => 
                            !(i.id === id && i.size === size && i.color === color)
                        ) 
                    })
                }
            },
            removeItem: (id, size, color) => {
                set({ 
                    items: get().items.filter((i: CartItem) => 
                        !(i.id === id && i.size === size && i.color === color)
                    ) 
                })
            },
            clearCart: () => set({ items: [], voucher: null }),
            setVoucher: (voucher) => set({ voucher }),
            totalItems: () => get().items.reduce((total: number, item: CartItem) => total + item.quantity, 0),
            totalPrice: () => {
                const subtotal = get().items.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0);
                const discount = get().discountAmount();
                return Math.max(0, subtotal - discount);
            },
            discountAmount: () => {
                const subtotal = get().items.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0);
                const voucher = get().voucher;
                if (!voucher) return 0;
                
                if (voucher.type === 'PERCENTAGE') {
                    return (subtotal * voucher.value) / 100;
                }
                return voucher.value;
            },
        }),
        {
            name: 'localbazar-cart-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
