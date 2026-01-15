// src/utils/formatters.js
export const formatType = (type) => {
  if (!type) return "";
  if (type === "mouse_keyboard") return "Mouse & Keyboard";
  return type.charAt(0).toUpperCase() + type.slice(1);
};

export const formatText = (text, fallback = "—") => {
  if (!text || text.trim() === "") return fallback;
  return text;
};
