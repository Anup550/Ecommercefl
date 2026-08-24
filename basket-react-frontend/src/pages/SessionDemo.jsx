import { useState } from "react";
import { basicLogin, checkSession, logoutSession } from "../api";
import ResponsePanel from "../components/ResponsePanel";

export default function SessionDemo() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [active, setActive] = useState("login");
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = async (which, fn) => {
    setActive(which);
    setLoading(true);
    setRes(await fn());
    setLoading(false);
  };

  return (
    <div className="page page--split">
      <div className="card">
        <h1>Basic auth &amp; server session</h1>
        <p className="muted">GET /basiclogin, /check_for_session, /logout</p>
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            run("login", () => basicLogin(username, password));
          }}
        >
          <label>
            Username
            <input value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button className="btn" disabled={loading}>
            {loading && active === "login" ? "signing in…" : "Basic login"}
          </button>
        </form>
        <div className="btn-row">
          <button
            className="btn btn--ghost"
            onClick={() => run("check", checkSession)}
            disabled={loading}
          >
            Check session
          </button>
          <button
            className="btn btn--ghost"
            onClick={() => run("logout", logoutSession)}
            disabled={loading}
          >
            Logout
          </button>
        </div>
        <p className="hint">
          Session state lives in a cookie the browser sends automatically — no token to
          copy around. Try Basic login, then Check session in a fresh tab reload.
        </p>
      </div>
      <ResponsePanel
        method="GET"
        path={
          active === "login"
            ? "/basiclogin"
            : active === "check"
            ? "/check_for_session"
            : "/logout"
        }
        status={res?.status}
        data={res?.data}
        error={res?.error}
      />
    </div>
  );
}
