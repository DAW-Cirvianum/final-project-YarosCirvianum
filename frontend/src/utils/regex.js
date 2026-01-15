// src/utils/regex.js

// Complexa (Standard): 8 chars, 1 majuscula, 1 minuscula, 1 numero, 1 especial
export const PWD_COMPLEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Simple (Testing): Minim 4 caracters
export const PWD_SIMPLE = /^.{4,}$/;

// Username: a-z, 0-9, max 15 (sense espais)
export const USERNAME_REGEX = /^[a-z0-9]{1,15}$/;

// Name: Lletres (amb accents) i espais. No numeros ni simbols
export const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s]+$/;