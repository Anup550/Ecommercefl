import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCart } from "../api";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const {
    items,
    setQuantity,
    removeItem,
    total,
    clear,
  } = useCart();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCart = async () => {
      const res = await getCart();

      if (res.ok) {
        console.log("Cart from backend:", res.data);

        /*
         * Your backend cart data is successfully received here.
         *
         * If your GET /cart response is already being returned
         * in the same structure as CartContext items, you can
         * synchronize it here.
         */

      } else {
        console.error("Failed to get cart:", res.data);

        setError(
          res.data?.msg ||
            res.data?.message ||
            "Failed to load cart"
        );
      }

      setLoading(false);
    };

    loadCart();
  }, []);

  return (
    <div className="page page--split">
      <div className="card">
        <h1>Cart</h1>

        <p className="muted">
          GET /cart
        </p>

        {loading && (
          <p className="muted">
            Loading cart...
          </p>
        )}

        {error && (
          <div className="banner">
            <strong>Error:</strong> {error}
          </div>
        )}

        {!loading && items.length === 0 && (
          <p className="hint">
            Your cart is empty. Go{" "}
            <Link to="/products">
              add something
            </Link>
            .
          </p>
        )}

        {!loading && items.length > 0 && (
          <>
            <div className="cart-list">
              {items.map((item) => {
                const price = Number(item.price);

                return (
                  <div
                    className="cart-row"
                    key={item.id}
                  >
                    <div className="cart-row__info">
                      <strong>
                        {item.name}
                      </strong>

                      <span className="muted">
                        ${price.toFixed(2)} each
                      </span>
                    </div>

                    <input
                      type="number"
                      min="1"
                      className="cart-row__qty"
                      value={item.quantity}
                      onChange={(e) =>
                        setQuantity(
                          item.id,
                          Number(e.target.value)
                        )
                      }
                    />

                    <span className="cart-row__subtotal">
                      $
                      {(
                        price * item.quantity
                      ).toFixed(2)}
                    </span>

                    <button
                      className="btn btn--ghost btn--small"
                      onClick={() =>
                        removeItem(item.id)
                      }
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="cart-total">
              <span>Total</span>

              <strong>
                ${Number(total).toFixed(2)}
              </strong>
            </div>

            <button
              className="btn btn--ghost"
              onClick={clear}
            >
              Clear cart
            </button>
          </>
        )}
      </div>
    </div>
  );
}