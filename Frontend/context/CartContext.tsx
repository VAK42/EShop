'use client'
import { createContext, useContext, useState, useEffect, useRef } from 'react'
export interface CartItem { id: number; title: string; price: number; quantity: number; imageUrl: string }
export interface Product { id: number; title: string; price: number; imageUrl: string }
interface CartContextType { items: CartItem[]; addToCart: (product: Product) => void; removeFromCart: (id: number) => void; removeOne: (id: number) => void; clearCart: () => void }
const CartContext = createContext<CartContextType>({ items: [], addToCart: () => { }, removeFromCart: () => { }, removeOne: () => { }, clearCart: () => { } })
export const useCart = () => useContext(CartContext)
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const initialized = useRef(false)
  useEffect(() => {
    const stored = localStorage.getItem('cart')
    if (stored) {
      setTimeout(() => setItems(JSON.parse(stored)), 0)
    }
    initialized.current = true
  }, [])
  useEffect(() => {
    if (initialized.current) {
      localStorage.setItem('cart', JSON.stringify(items))
    }
  }, [items])
  const addToCart = (product: Product) => {
    setItems(prev => {
      const ex = prev.find(i => i.id === product.id)
      if (ex) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { id: product.id, title: product.title, price: product.price, quantity: 1, imageUrl: product.imageUrl }]
    })
  }
  const removeFromCart = (id: number) => setItems(prev => prev.filter(i => i.id !== id))
  const removeOne = (id: number) => {
    setItems(prev => prev.map(i => i.id === id && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i))
  }
  const clearCart = () => setItems([])
  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, removeOne, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}