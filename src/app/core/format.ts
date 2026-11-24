/** Formatos de los números del tablero, en castellano. */

const NO_DATA = '—';

/** 0.746 → "74,6 %" */
export function formatRate(rate: number | null | undefined): string {
  if (rate === null || rate === undefined) return NO_DATA;
  return `${(rate * 100).toLocaleString('es-AR', { maximumFractionDigits: 1 })} %`;
}

/** 166.3 → "2 min 46 s"; 45 → "45 s" */
export function formatSeconds(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined) return NO_DATA;
  const total = Math.round(seconds);
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  if (minutes === 0) return `${rest} s`;
  return rest === 0 ? `${minutes} min` : `${minutes} min ${rest} s`;
}

/** 1 → "1 sesión"; 3 → "3 sesiones" */
export function formatSessions(count: number): string {
  return `${count.toLocaleString('es-AR')} ${count === 1 ? 'sesión' : 'sesiones'}`;
}
