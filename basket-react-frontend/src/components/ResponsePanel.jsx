// Shows exactly what went over the wire. This app is a console for testing
// the Flask backend, so surfacing the real request/response is the point --
// not a toast that hides the useful part.
export default function ResponsePanel({ method, path, status, data, error }) {
  if (!status && !error) {
    return (
      <div className="panel panel--idle">
        <span className="panel__dot" />
        waiting for a request&hellip;
      </div>
    );
  }

  const ok = status >= 200 && status < 300;

  return (
    <div className={`panel ${ok ? "panel--ok" : "panel--err"}`}>
      <div className="panel__head">
        <span className="panel__dot" />
        <span className="panel__method">{method}</span>
        <span className="panel__path">{path}</span>
        <span className="panel__status">{error ? "ERR" : status}</span>
      </div>
      <pre className="panel__body">
        {error ? error : JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
