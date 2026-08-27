import { useEffect, useState } from "react";
import { listProducts, addToCart } from "../api";
import { useCart } from "../context/CartContext";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [justAdded, setJustAdded] = useState(null);

  const { addItem, count } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      const res = await listProducts();

      if (res.ok && Array.isArray(res.data)) {
        setProducts(res.data);
      } else {
        setError(res.data || res.error || "Failed to load products");
      }

      setLoading(false);
    };

    loadProducts();
  }, []);

  const handleAdd = async (product) => {
    try {
      const res = await addToCart(product.id, 1);

      if (res.ok) {
        // Update frontend cart state
        addItem({
          ...product,
          price: Number(product.price),
        });

        setJustAdded(product.id);

        setTimeout(() => {
          setJustAdded(null);
        }, 900);
      } else {
        console.error("Add to cart failed:", res.data);
        alert(
          res.data?.msg ||
            res.data?.message ||
            "Failed to add product to cart"
        );
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("Something went wrong while adding the product");
    }
  };

  return (
    <div className="page">
      <div className="page__head">
        <h1>Products</h1>
        <p className="muted">GET /products</p>
      </div>

      {loading && <p className="muted">Loading products...</p>}

      {error && (
        <div className="banner">
          <strong>Error:</strong>{" "}
          {typeof error === "string"
            ? error
            : JSON.stringify(error)}
        </div>
      )}

      {!loading && !error && (
        <div className="grid">
          {products.map((product) => {
            const price = Number(product.price);

            return (
              <div className="product-card" key={product.id}>
                <div className="product-card__top">
                  <span className="product-card__id">
                    #{product.id}
                  </span>

                  <span className="product-card__price">
                    ${price.toFixed(2)}
                  </span>
                </div>

                <h3>{product.name}</h3>

                <p className="muted">
                  {product.description}
                </p>

                <button
                  className="btn btn--small"
                  onClick={() => handleAdd(product)}
                >
                  {justAdded === product.id
                    ? "Added ✓"
                    : "Add to cart"}
                </button>
              </div>
            );
          })}
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