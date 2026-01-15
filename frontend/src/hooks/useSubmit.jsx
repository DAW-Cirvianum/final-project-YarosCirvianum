// src/hooks/useSubmit.jsx
import { useState } from "react";
import api from "../services/api";

export function useSubmit(url, method = "post", onSuccess) {
  const [errors, setErrors] = useState(null);
  const [sending, setSending] = useState(false);

  const submit = async (data) => {
    setSending(true);
    setErrors(null);
    try {
      const res = await api[method](url, data);
      if (onSuccess) onSuccess(res.data.data);
      return { ok: true };
    } catch (err) {
      // Capturem 401 (Credencials invalides), 403 (No verificat), 422 
      if (err.response && [422, 401, 403].includes(err.response.status)) {
        setErrors(err.response.data.errors); 
      }
      return { ok: false };
    } finally {
      setSending(false);
    }
  };

  return { submit, errors, sending };
}