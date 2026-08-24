import { useEffect, useState } from "react";
import { listProducts } from "../api";
import { useCart } from "../context/CartContext";

// Shown only if GET /products isn't implemented yet (or fails), so the shop
// is still browsable while you build the backend. Swap out freely.
const DEMO_PRODUCTS = [
  { id: 1, name: "Trail Runner Sneakers", price: 74.0, description: "Lightweight mesh, grippy sole." },
  { id: 2, name: "Insulated Water Bottle", price: 19.5, description: "Keeps cold 24h, hot 12h." },
  { id: 3, name: "Canvas Tote Bag", price: 22.0, description: "Heavy 12oz canvas, reinforced base." },
  { id: 4, name: "Wireless Earbuds", price: 59.99, description: "ANC, 30h case battery." },
  { id: 5, name: "Notebook — Dot Grid", price: 12.0, description: "160gsm paper, lays flat." },
  { id: 6, name: "Ceramic Pour-Over Set", price: 34.0, description: "Includes dripper + mug." },
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [usingDemoData, setUsingDemoData] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addItem, count } = useCart();
  const [justAdded, setJustAdded] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await listProducts();
      if (res.ok && Array.isArray(res.data) && res.data.length) {
        setProducts(res.data);
      } else {
        setProducts(DEMO_PRODUCTS);
        setUsingDemoData(true);
      }
      setLoading(false);
    })();
  }, []);

  const handleAdd = (p) => {
    addItem(p);
    setJustAdded(p.id);
    setTimeout(() => setJustAdded(null), 900);
  };

  return (
    <div className="page">
      <div className="page__head">
        <h1>Products</h1>
        <p className="muted">GET /products</p>
      </div>

      {usingDemoData && (
        <div className="banner">
          <code>GET /products</code> isn't returning data yet, so this page is showing demo
          items. Implement it to return{" "}
          <code>[{"{ id, name, price, description }"}]</code> and this banner disappears.
        </div>
      )}

      {loading ? (
        <p className="muted">loading…</p>
      ) : (
        <div className="grid">
          {products.map((p) => (
            <div className="product-card" key={p.id}>
              <div className="product-card__top">
                <span className="product-card__id">#{p.id}</span>
                <span className="product-card__price">${p.price.toFixed(2)}</span>
              </div>
              <h3>{p.name}</h3>
              <p className="muted">{p.description}</p>
              <button className="btn btn--small" onClick={() => handleAdd(p)}>
                {justAdded === p.id ? "Added ✓" : "Add to cart"}
              </button>
            </div>
          ))}
        </div>
      )}

      {count > 0 && (
        <div className="floating-cart">
          {count} item{count > 1 ? "s" : ""} in cart
        </div>
      )}
    </div>
  );
}
