/** Nombres para mostrar de los muebles del Taller. La API devuelve solo los identificadores. */
export const FURNITURE = [
  { id: 'living_room_table', name: 'Mesa ratona' },
  { id: 'stool', name: 'Taburete' },
  { id: 'chair', name: 'Silla' },
] as const;

export function furnitureName(id: string | null | undefined): string {
  return FURNITURE.find((furniture) => furniture.id === id)?.name ?? id ?? 'Sin dato';
}
