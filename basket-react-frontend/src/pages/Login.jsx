import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ResponsePanel from "../components/ResponsePanel";

export default function Login() {
  const { login, accessToken, refresh } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [res, setRes] = useState(null);
  const [refreshRes, setRefreshRes] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const r = await login(username, password);
    setRes(r);
    setLoading(false);
  };

  const doRefresh = async () => {
    const r = await refresh();
    setRefreshRes(r);
  };

  return (
    <div className="page page--split">
      <div className="card">
        <h1>Log in</h1>
        <p className="muted">POST /login</p>
        <form onSubmit={submit} className="form">
          <label>
            Username
            <input value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button className="btn" disabled={loading}>
            {loading ? "signing in…" : "Login"}
          </button>
        </form>

        {accessToken && (
          <div className="token-box">
            <div className="token-box__row">
              <span className="muted">access_token</span>
              <code>{accessToken.slice(0, 28)}…</code>
            </div>
            <button className="btn btn--ghost btn--small" onClick={doRefresh}>
              refresh access token
            </button>
          </div>
        )}
      </div>
      <div className="stack">
        <ResponsePanel
          method="POST"
          path="/login"
          status={res?.status}
          data={res?.data}
          error={res?.error}
        />
        {refreshRes && (
          <ResponsePanel
            method="POST"
            path="/refrash"
            status={refreshRes.status}
            data={refreshRes.data}
            error={refreshRes.error}
          />
        )}
      </div>
    </div>
  );
}
