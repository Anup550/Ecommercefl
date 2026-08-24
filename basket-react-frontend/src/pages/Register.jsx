import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ResponsePanel from "../components/ResponsePanel";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const r = await register(username, password);
    setRes(r);
    setLoading(false);
  };

  return (
    <div className="page page--split">
      <div className="card">
        <h1>Create an account</h1>
        <p className="muted">POST /register</p>
        <form onSubmit={submit} className="form">
          <label>
            Username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="anup"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
            />
          </label>
          <button className="btn" disabled={loading}>
            {loading ? "creating…" : "Register"}
          </button>
        </form>
        {res?.ok && (
          <p className="hint">
            Registered. Head to <Link to="/login">Login</Link> to get your tokens.
          </p>
        )}
      </div>
      <ResponsePanel
        method="POST"
        path="/register"
        status={res?.status}
        data={res?.data}
        error={res?.error}
      />
    </div>
  );
}
