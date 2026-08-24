import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../api";
import ResponsePanel from "../components/ResponsePanel";

export default function Cart() {
  const { items, setQuantity, removeItem, total, clear } = useCart();
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkout = async () => {
    setLoading(true);
    const orderItems = items.map((i) => ({ product_id: i.id, quantity: i.quantity }));
    const r = await placeOrder(orderItems);
    setRes(r);
    setLoading(false);
    if (r.ok) clear();
  };

  return (
    <div className="page page--split">
      <div className="card">
        <h1>Cart</h1>
        <p className="muted">POST /orders — needs an access token, requires backend work</p>

        {items.length === 0 ? (
          <p className="hint">
            Your cart is empty. Go <Link to="/products">add something</Link>.
          </p>
        ) : (
          <>
            <div className="cart-list">
              {items.map((i) => (
                <div className="cart-row" key={i.id}>
                  <div className="cart-row__info">
                    <strong>{i.name}</strong>
                    <span className="muted">${i.price.toFixed(2)} each</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    className="cart-row__qty"
                    value={i.quantity}
                    onChange={(e) => setQuantity(i.id, Number(e.target.value))}
                  />
                  <span className="cart-row__subtotal">
                    ${(i.price * i.quantity).toFixed(2)}
                  </span>
                  <button className="btn btn--ghost btn--small" onClick={() => removeItem(i.id)}>
                    remove
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-total">
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
            <button className="btn" onClick={checkout} disabled={loading}>
              {loading ? "placing order…" : "Place order"}
            </button>
          </>
        )}
      </div>
      <ResponsePanel
        method="POST"
        path="/orders"
        status={res?.status}
        data={res?.data}
        error={res?.error}
      />
    </div>
  );
}
