// src/utils/formatters.js

// FORMAT TIPUS (Capitalització i casos especials)
/**
 * Transforma el text d'un tipus de dispositiu per a la interficie.
 * Aplica majuscula a la primera lletra i gestiona excepcions de format.
 * @param {string} type - El nom del tipus original.
 * @returns {string} El text transformat o buit si no n'hi ha.
 */
export const formatType = (type) => {
  if (!type) return "";
  
  // Casos especials
  if (type === "mouse_keyboard") return "Mouse & Keyboard";
  
  // Per defecte: Primera lletra majúscula
  return type.charAt(0).toUpperCase() + type.slice(1);
};

// FORMAT TEXT (Gestió de valors buits/nuls)
/**
 * Garanteix el retorn d'un text valid o un valor de reserva.
 * @param {any} text - El contingut que es vol validar.
 * @param {string} [fallback="—"] - Text a mostrar si el valor es nul o buit.
 * @returns {any} El text validat o el contingut de reserva.
 */
export const formatText = (text, fallback = "—") => {
  // Si és null, undefined o false
  if (!text) return fallback;
  
  // Si és un string i està buit (només espais)
  if (typeof text === 'string' && text.trim() === "") return fallback;
  
  return text;
};