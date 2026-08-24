import { useState } from "react";
import { simpleCache, fileCache } from "../api";
import ResponsePanel from "../components/ResponsePanel";

export default function CacheDemo() {
  const [active, setActive] = useState("simple");
  const [res, setRes] = useState(null);
  const [ms, setMs] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = async (which, fn) => {
    setActive(which);
    setLoading(true);
    const start = performance.now();
    const r = await fn();
    setMs(Math.round(performance.now() - start));
    setRes(r);
    setLoading(false);
  };

  return (
    <div className="page page--split">
      <div className="card">
        <h1>Cache demo</h1>
        <p className="muted">GET /simple_cache, /file_cache — first call sleeps 5s server-side</p>
        <div className="btn-row">
          <button className="btn" onClick={() => run("simple", simpleCache)} disabled={loading}>
            {loading && active === "simple" ? "waiting…" : "Call /simple_cache"}
          </button>
          <button
            className="btn btn--ghost"
            onClick={() => run("file", fileCache)}
            disabled={loading}
          >
            {loading && active === "file" ? "waiting…" : "Call /file_cache"}
          </button>
        </div>
        {ms !== null && (
          <p className="hint">
            Round trip took <strong>{ms}ms</strong>. Call the same route again —
            it should return almost instantly once cached.
          </p>
        )}
      </div>
      <ResponsePanel
        method="GET"
        path={active === "simple" ? "/simple_cache" : "/file_cache"}
        status={res?.status}
        data={res?.data}
        error={res?.error}
      />
    </div>
  );
}
