import { useState, useEffect } from "react";

export function useFetch(url, token = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function doFetch() {
      try {
        setLoading(true);

        const headers = {
          Accept: "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(url, { headers });

        if (!response.ok) {
          // Intentem llegir error JSON, si hi ha
          let errMsg = `HTTP error: ${response.status}`;
          try {
            const errData = await response.json();
            if (errData.message) errMsg = errData.message;
          } catch (e) {}
          throw new Error(errMsg);
        }

        const json = await response.json();
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    doFetch();
    return () => {
      cancelled = true;
    };
  }, [url, token]);

  return { data, loading, error };
}
