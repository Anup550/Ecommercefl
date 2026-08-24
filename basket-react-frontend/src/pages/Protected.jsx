import { useState } from "react";
import { getProtected } from "../api";
import { useAuth } from "../context/AuthContext";
import ResponsePanel from "../components/ResponsePanel";

export default function Protected() {
  const { accessToken } = useAuth();
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);

  const call = async () => {
    setLoading(true);
    setRes(await getProtected());
    setLoading(false);
  };

  return (
    <div className="page page--split">
      <div className="card">
        <h1>Protected route</h1>
        <p className="muted">GET /protected — requires a valid access token</p>
        {!accessToken && (
          <p className="hint hint--warn">
            No access token stored yet. Log in first, then come back here.
          </p>
        )}
        <button className="btn" onClick={call} disabled={loading}>
          {loading ? "calling…" : "Call /protected"}
        </button>
      </div>
      <ResponsePanel
        method="GET"
        path="/protected"
        status={res?.status}
        data={res?.data}
        error={res?.error}
      />
    </div>
  );
}
