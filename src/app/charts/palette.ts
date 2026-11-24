/**
 * Colores de los gráficos, derivados de la paleta del portfolio y del Taller.
 *
 * Los tres colores categóricos se validaron con el validador de paletas del skill de visualización
 * (todos los pares, sobre fondo blanco): banda de luminosidad, saturación, separación para daltonismo
 * (ΔE ≥ 8,3), separación con visión normal (ΔE ≥ 19,1) y contraste ≥ 3:1. Se asignan siempre en el
 * mismo orden y cada uno sigue a la misma idea en todos los gráficos: verde azulado = correctas.
 */
export const SERIES = {
  teal: '#0f7f9e',
  orange: '#c8682a',
  plum: '#a0306a',
} as const;

/** Rampa secuencial (un solo tono, de claro a oscuro) para el mapa de calor. */
export const SEQUENTIAL = ['#e3f1f5', '#b9dce6', '#84c1d2', '#4ea2bb', '#1f82a0', '#0f5f78', '#0a4152'];

/** Tinta y estructura: los textos nunca usan el color de una serie. */
export const INK = {
  primary: '#2b4a57',
  secondary: '#4a5a61',
  muted: '#5f6e74',
  grid: '#e5e8e9',
  axis: '#c7cdcf',
  surface: '#ffffff',
} as const;
