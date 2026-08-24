# Basket — React frontend for your Flask API

A dashboard-style frontend that exercises every route in your Flask blueprint
(register, login, JWT refresh, protected route, basic-auth session, cookies,
cache demo) plus a product-ordering flow (browse → cart → place order) for
the backend you're about to build.

## Run it

```bash
npm install
npm run dev
```

Opens on `http://localhost:5173`. In dev, any request to `/api/*` is proxied
to `http://127.0.0.1:5000` (your Flask app) — see `vite.config.js` if it runs
on a different port.

Your Flask app needs CORS + credentials enabled for cookies/sessions to work
cross-origin in production:

```python
from flask_cors import CORS
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])
```

And `SESSION_COOKIE_SAMESITE="None"` + `SESSION_COOKIE_SECURE=True` if you
deploy frontend and backend on different domains over HTTPS.

## What's wired up already

| Page | Route(s) hit |
|---|---|
| Register | `POST /register` |
| Login | `POST /login`, `POST /refrash` |
| Protected route | `GET /protected` (Bearer token) |
| Basic auth & session | `GET /basiclogin`, `/check_for_session`, `/logout` |
| Cookies | `GET /search/<item>`, `/get_cookies`, `/deleate_cookie` |
| Cache demo | `GET /simple_cache`, `/file_cache` |
| Products | `GET /products` *(not built yet — falls back to demo data)* |
| Cart | `POST /orders` *(not built yet)* |

Every page shows the live request path, HTTP status, and raw JSON response
in the panel on the right, so you can see exactly what your backend sent
back while you build it.

## Product ordering — what the backend needs

The frontend already assumes this shape. Build your routes to match (or
tell me your actual routes/response shape and I'll adjust `src/api.js`):

```
GET  /products
  -> [{ "id": 1, "name": "...", "price": 19.99, "description": "..." }]

POST /orders          (Authorization: Bearer <access_token>)
  body: { "items": [{ "product_id": 1, "quantity": 2 }] }
  -> { "order_id": 12, "status": "placed", "total": 39.98 }

GET  /orders          (Authorization: Bearer <access_token>)
  -> [{ "id": 12, "items": [...], "total": 39.98, "status": "placed", "created_at": "..." }]
```

Tokens are stored in `localStorage` (`access_token`, `refresh_token`,
`username`) and auto-attached as `Authorization: Bearer ...` wherever a
route needs `auth: true` in `src/api.js`.

## Project layout

```
src/
  api.js                 <- every fetch call to Flask lives here
  context/AuthContext.jsx  auth state (tokens, login/register/refresh/logout)
  context/CartContext.jsx  cart state
  components/Sidebar.jsx
  components/ResponsePanel.jsx  <- shows live request/response
  pages/                  <- one file per route above
```
