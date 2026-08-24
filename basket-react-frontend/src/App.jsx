import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Protected from "./pages/Protected";
import SessionDemo from "./pages/SessionDemo";
import CookieDemo from "./pages/CookieDemo";
import CacheDemo from "./pages/CacheDemo";
import Products from "./pages/Products";
import Cart from "./pages/Cart";

export default function App() {
  return (
    <div className="shell">
      <Sidebar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/protected" element={<Protected />} />
          <Route path="/session" element={<SessionDemo />} />
          <Route path="/cookies" element={<CookieDemo />} />
          <Route path="/cache" element={<CacheDemo />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
    </div>
  );
}
