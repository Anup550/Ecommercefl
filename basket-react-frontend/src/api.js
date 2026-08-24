// Talks to your Flask backend. In dev, requests to /api/* are proxied to
// http://127.0.0.1:5000 by vite.config.js (edit the target there if needed).
// In production, set VITE_API_URL to your deployed backend origin.
const BASE = import.meta.env.VITE_API_URL || "/api";

function getToken(key) {
  return localStorage.getItem(key);
}

/**
 * Low-level request helper. Returns { ok, status, data, raw } so callers can
 * inspect real HTTP status/JSON instead of only catching thrown errors --
 * handy for the console panels that show the raw response.
 */
export async function request(
  path,
  { method = "GET", body, auth, refreshAuth, basicAuth, credentials } = {}
) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = getToken("access_token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  if (refreshAuth) {
    const token = getToken("refresh_token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  if (basicAuth) {
    headers.Authorization = `Basic ${btoa(`${basicAuth.username}:${basicAuth.password}`)}`;
  }

  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      credentials: credentials || "include", // send session cookies
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    return {
      ok: false,
      status: 0,
      data: null,
      error: "Network error -- is the Flask server running?",
    };
  }

  let data = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  return { ok: res.ok, status: res.status, data };
}

// --- Auth ------------------------------------------------------------
export const registerUser = (username, password) =>
  request("/register", { method: "POST", body: { username, password } });

export const loginUser = (username, password) =>
  request("/login", { method: "POST", body: { username, password } });

export const refreshToken = () => request("/refrash", { method: "POST", refreshAuth: true });

export const getProtected = () => request("/protected", { auth: true });

// --- Basic auth + session ---------------------------------------------
export const basicLogin = (username, password) =>
  request("/basiclogin", { basicAuth: { username, password } });

export const checkSession = () => request("/check_for_session");

export const logoutSession = () => request("/logout");

// --- Cookies ------------------------------------------------------------
export const searchItem = (item) => request(`/search/${encodeURIComponent(item)}`);

export const getCookies = () => request("/get_cookies");

export const deleteCookie = () => request("/deleate_cookie");

// --- Cache demo ------------------------------------------------------------
export const simpleCache = () => request("/simple_cache");

export const fileCache = () => request("/file_cache");

// --- Products / Orders --------------------------------------------------
// These endpoints don't exist on the backend yet -- build them to match
// this shape (or tell me your real routes and I'll line the frontend up):
//   GET  /products                 -> [{ id, name, price, description, image }]
//   POST /orders   { items: [{product_id, quantity}] }  -> { order_id, status, total }
//   GET  /orders                   -> [{ id, items, total, status, created_at }]
export const listProducts = () => request("/products");
export const placeOrder = (items) =>
  request("/orders", { method: "POST", body: { items }, auth: true });
export const listOrders = () => request("/orders", { auth: true });
