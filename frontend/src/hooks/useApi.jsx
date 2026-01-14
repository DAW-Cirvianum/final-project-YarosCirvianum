// src/hooks/useApi.jsx
import { useState, useEffect } from "react";
import api from "../services/api";

export function useGet(url, params = {}) {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    setLoading(true);
    const cleanParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v));
    api.get(url, { params: cleanParams })
      .then((res) => {
        setData(res.data.data);
        setMeta(res.data.meta); // Aquí Laravel posa la paginació
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { refresh(); }, [url, JSON.stringify(params)]);

  return { data, loading, refresh, meta };
}