import { SessionItem } from './models';

export type Outcome = 'correct' | 'incorrect' | 'not_checked';

/** Resultado de una sesión, con las mismas tres partes que la dona del tablero. */
export function sessionOutcome(session: SessionItem): Outcome {
  const summary = session.summary;
  if (summary?.outcome !== 'checked') return 'not_checked';
  return summary.correct ? 'correct' : 'incorrect';
}

export const OUTCOME_LABELS: Record<Outcome, string> = {
  correct: 'Correcta',
  incorrect: 'Con errores',
  not_checked: 'Sin comprobar',
};

/** Nombres de los eventos del Taller y de Bitácora, para el recorrido de una sesión. */
export const EVENT_NAMES: Record<string, string> = {
  assembly_started: 'Inicio del armado',
  joint_completed: 'Unión',
  joint_attempt_failed: 'Intento fallido',
  joint_undone: 'Unión deshecha',
  help_viewed: 'Ayuda',
  controls_viewed: 'Controles',
  assembly_checked: 'Comprobación',
  assembly_abandoned: 'Abandono',
  session_paused: 'Pausa',
  session_resumed: 'Reanudación',
};

export function eventName(type: string): string {
  return EVENT_NAMES[type] ?? type;
}

/** 95.4 → "1:35" */
export function formatClock(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}
