// src/hooks/useApi.jsx
import { useState, useEffect } from "react";
import api from "../services/api";
import { useNotify } from "../context/NotificationContext";

export function useGet(url, params = {}) {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const { notify, ask } = useNotify();

  const refresh = () => {
    setLoading(true);
    const clean = Object.fromEntries(Object.entries(params).filter(([_, v]) => v));
    api.get(url, { params: clean }).then(res => { setData(res.data.data); setMeta(res.data.meta); }).finally(() => setLoading(false));
  };

  const deleteItem = async (id) => {
    if (await ask()) {
      try {
        await api.delete(`${url}/${id}`);
        notify("Deleted successfully");
        refresh();
      } catch (err) { notify("Error deleting item", true); }
    }
  };

  useEffect(() => { refresh(); }, [url, JSON.stringify(params)]);
  return { data, loading, refresh, meta, deleteItem };
}