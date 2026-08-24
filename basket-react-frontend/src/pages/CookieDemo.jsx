import { useState } from "react";
import { searchItem, getCookies, deleteCookie } from "../api";
import ResponsePanel from "../components/ResponsePanel";

export default function CookieDemo() {
  const [item, setItem] = useState("running-shoes");
  const [active, setActive] = useState(null);
  const [path, setPath] = useState("");
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = async (which, p, fn) => {
    setActive(which);
    setPath(p);
    setLoading(true);
    setRes(await fn());
    setLoading(false);
  };

  return (
    <div className="page page--split">
      <div className="card">
        <h1>Cookies</h1>
        <p className="muted">GET /search/&lt;item&gt;, /get_cookies, /deleate_cookie</p>
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            run("search", `/search/${item}`, () => searchItem(item));
          }}
        >
          <label>
            Item to search
            <input value={item} onChange={(e) => setItem(e.target.value)} />
          </label>
          <button className="btn" disabled={loading}>
            {loading && active === "search" ? "searching…" : "Search (sets cookie)"}
          </button>
        </form>
        <div className="btn-row">
          <button
            className="btn btn--ghost"
            onClick={() => run("get", "/get_cookies", getCookies)}
            disabled={loading}
          >
            Read stored cookie
          </button>
          <button
            className="btn btn--ghost"
            onClick={() => run("delete", "/deleate_cookie", deleteCookie)}
            disabled={loading}
          >
            Delete cookie
          </button>
        </div>
      </div>
      <ResponsePanel
        method="GET"
        path={path || "/search/<item>"}
        status={res?.status}
        data={res?.data}
        error={res?.error}
      />
    </div>
  );
}
