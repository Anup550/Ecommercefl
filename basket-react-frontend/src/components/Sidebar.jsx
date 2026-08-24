import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const links = [
  { to: "/", label: "Register", group: "Auth" },
  { to: "/login", label: "Login", group: "Auth" },
  { to: "/protected", label: "Protected route", group: "Auth" },
  { to: "/session", label: "Basic auth + session", group: "Session" },
  { to: "/cookies", label: "Cookies", group: "Session" },
  { to: "/cache", label: "Cache demo", group: "Session" },
  { to: "/products", label: "Products", group: "Shop" },
  { to: "/cart", label: "Cart", group: "Shop" },
];

export default function Sidebar() {
  const { username, logout } = useAuth();
  const { count } = useCart();

  const groups = links.reduce((acc, l) => {
    (acc[l.group] ||= []).push(l);
    return acc;
  }, {});

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__mark">▣</span> Basket
      </div>
      <div className="sidebar__sub">Flask API console</div>

      {Object.entries(groups).map(([group, items]) => (
        <div key={group} className="sidebar__group">
          <div className="sidebar__group-label">{group}</div>
          {items.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                "sidebar__link" + (isActive ? " sidebar__link--active" : "")
              }
            >
              {l.label}
              {l.to === "/cart" && count > 0 && (
                <span className="sidebar__badge">{count}</span>
              )}
            </NavLink>
          ))}
        </div>
      ))}

      <div className="sidebar__foot">
        {username ? (
          <>
            <div className="sidebar__user">
              signed in as <strong>{username}</strong>
            </div>
            <button className="btn btn--ghost btn--small" onClick={logout}>
              clear tokens
            </button>
          </>
        ) : (
          <div className="sidebar__user sidebar__user--muted">not signed in</div>
        )}
      </div>
    </aside>
  );
}
