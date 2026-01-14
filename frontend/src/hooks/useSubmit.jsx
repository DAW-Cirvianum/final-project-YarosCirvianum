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
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors); // Captura els errors de Laravel
      }
      return { ok: false };
    } finally {
      setSending(false);
    }
  };

  return { submit, errors, sending };
}
