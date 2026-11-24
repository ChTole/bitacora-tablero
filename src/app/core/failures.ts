/** Motivos de falla de un encastre (ver docs/metricas.md de bitacora-api), en el orden del tablero. */
export const REASONS = [
  { id: 'position', name: 'Posición', description: 'La espiga no quedó alineada con la caja' },
  { id: 'blocked', name: 'Bloqueada', description: 'Otra pieza impedía el encastre' },
  { id: 'orientation', name: 'Orientación', description: 'La pieza estaba girada o volcada' },
  { id: 'incompatible', name: 'Incompatible', description: 'La espiga no corresponde a esa caja' },
] as const;

export function reasonName(id: string): string {
  return REASONS.find((reason) => reason.id === id)?.name ?? id;
}

/** "Table/Mortise_BR" → "Table · BR" */
export function mortiseName(id: string): string {
  return id
    .split('/')
    .map((part) => part.replace(/^Mortise_?/, ''))
    .filter(Boolean)
    .join(' · ');
}
