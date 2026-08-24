import { createContext, useContext, useState, useMemo } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{ id, name, price, quantity }]

  const addItem = (product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const setQuantity = (id, quantity) =>
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );

  const clear = () => setItems([]);

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, setQuantity, clear, total, count }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
