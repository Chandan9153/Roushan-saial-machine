import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'roushan_cart_v1';

function loadCart() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items]);

  function addToCart(product, quantity = 1) {
    setItems((prev) => {
      const found = prev.find((i) => i.product === product._id);
      if (found) return prev.map((i) => (i.product === product._id ? { ...i, quantity: i.quantity + quantity } : i));
      return [...prev, { product: product._id, name: product.name, price: product.price, image: product.images?.[0] || '', quantity }];
    });
  }
  function updateQuantity(productId, quantity) {
    if (quantity < 1) return;
    setItems((prev) => prev.map((i) => (i.product === productId ? { ...i, quantity } : i)));
  }
  function removeFromCart(productId) { setItems((prev) => prev.filter((i) => i.product !== productId)); }
  function clearCart() { setItems([]); }

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + (i.price || 0) * i.quantity, 0);
  const value = useMemo(() => ({ items, count, subtotal, addToCart, updateQuantity, removeFromCart, clearCart }), [items, count, subtotal]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
