// src/utils/regex.js

// Password complex (Standard): 8 chars, 1 majuscula, 1 minuscula, 1 numero, 1 especial
/**
 * Expressio regular per a contrasenyes complexes.
 * Requereix minim 8 caracters, una majuscula, una minuscula, un numero i un caracter especial.
 */
export const PWD_COMPLEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Simple (Testing): Minim 4 caracters
/**
 * Expressio regular per a contrasenyes simples de prova.
 * Requereix un minim de 4 caracters de qualsevol tipus.
 */
export const PWD_SIMPLE = /^.{4,}$/;

// Username: a-z, 0-9, max 15 (sense espais)
/**
 * Expressio regular per a noms d'usuari.
 * Permet minuscules i numeros, amb un maxim de 15 caracters i sense espais.
 */
export const USERNAME_REGEX = /^[a-z0-9]{1,15}$/;

// Name: Lletres (amb accents) i espais. No numeros ni simbols
/**
 * Expressio regular per a noms de persones.
 * Permet lletres (incloses les que porten accents) i espais. No permet numeros ni simbols.
 */
export const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s]+$/;