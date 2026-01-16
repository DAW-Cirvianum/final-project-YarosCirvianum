// src/hooks/useSubmit.jsx
import { useState } from "react";
import api from "../services/api";
import { useNotify } from "../context/NotificationContext";

export function useSubmit(url, method = "post", onSuccess) {
  const [errors, setErrors] = useState(null);
  const [sending, setSending] = useState(false);
  const { notify } = useNotify();

  const submit = async (data) => {
    setSending(true); setErrors(null);
    try {
      const res = await api[method](url, data);
      notify("Action completed successfully");
      if (onSuccess) onSuccess(res.data.data);
      return { ok: true };
    } catch (err) {
      notify("Please check the form", "error");
      if (err.response && [422, 401, 403].includes(err.response.status)) {
        setErrors(err.response.data.errors);
      }
      return { ok: false };
    } finally { setSending(false); }
  };

  return { submit, errors, sending };
}