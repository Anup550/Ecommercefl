// Talks to your Flask backend.
// In development, /api/* is proxied to Flask by Vite.

const BASE = import.meta.env.VITE_API_URL || "/api";

function getToken(key) {
  return localStorage.getItem(key);
}

export async function request(
  path,
  {
    method = "GET",
    body,
    auth = false,
    refreshAuth = false,
    basicAuth,
    credentials = "include",
  } = {}
) {
  const headers = {
    "Content-Type": "application/json",
  };

  // Access token
  if (auth) {
    const token = getToken("access_token");

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  // Refresh token
  if (refreshAuth) {
    const token = getToken("refresh_token");

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  // Basic authentication
  if (basicAuth) {
    headers.Authorization =
      `Basic ${btoa(
        `${basicAuth.username}:${basicAuth.password}`
      )}`;
  }

  let response;

  try {
    response = await fetch(`${BASE}${path}`, {
      method,
      headers,
      credentials,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    console.error("Network error:", error);

    return {
      ok: false,
      status: 0,
      data: null,
      error: "Network error. Is the Flask server running?",
    };
  }

  let data = null;

  const text = await response.text();

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}


// =====================================================
// AUTH
// =====================================================

export const registerUser = (username, password) =>
  request("/register", {
    method: "POST",
    body: {
      username,
      password,
    },
  });

export const loginUser = (username, password) =>
  request("/login", {
    method: "POST",
    body: {
      username,
      password,
    },
  });

export const refreshToken = () =>
  request("/refrash", {
    method: "POST",
    refreshAuth: true,
  });

export const getProtected = () =>
  request("/protected", {
    auth: true,
  });


// =====================================================
// BASIC AUTH + SESSION
// =====================================================

export const basicLogin = (username, password) =>
  request("/basiclogin", {
    basicAuth: {
      username,
      password,
    },
  });

export const checkSession = () =>
  request("/check_for_session");

export const logoutSession = () =>
  request("/logout");


// =====================================================
// COOKIES
// =====================================================

export const searchItem = (item) =>
  request(`/search/${encodeURIComponent(item)}`);

export const getCookies = () =>
  request("/get_cookies");

export const deleteCookie = () =>
  request("/deleate_cookie");


// =====================================================
// CACHE
// =====================================================

export const simpleCache = () =>
  request("/simple_cache");

export const fileCache = () =>
  request("/file_cache");


// =====================================================
// PRODUCTS
// =====================================================

export const listProducts = () =>
  request("/products");


// =====================================================
// CART
// =====================================================

// Add product to cart
export const addToCart = (userId, productId, quantity = 1) =>
  request("/cart", {
    method: "POST",
    body: {
      user_id: userId,
      product_id: productId,
      quantity: quantity,
    },
  });


// Get current user's cart
export const getCart = () =>
  request("/cart");


// =====================================================
// ORDERS
// =====================================================

// Keep these for later when your Flask /orders API is implemented.

export const placeOrder = (items) =>
  request("/orders", {
    method: "POST",
    body: {
      items,
    },
    auth: true,
  });

export const listOrders = () =>
  request("/orders", {
    auth: true,
  });