import { eventDetail, secondsFromStart } from '../charts/session-journey';
import { SessionItem } from './models';
import { formatClock, sessionOutcome } from './sessions';

const item = (summary: Partial<SessionItem['summary']> | null) => ({ summary }) as SessionItem;

describe('sesiones', () => {
  it('clasifica el resultado como la dona del tablero', () => {
    expect(sessionOutcome(item({ outcome: 'checked', correct: true }))).toBe('correct');
    expect(sessionOutcome(item({ outcome: 'checked', correct: false }))).toBe('incorrect');
    expect(sessionOutcome(item({ outcome: 'abandoned', correct: false }))).toBe('not_checked');
    expect(sessionOutcome(item(null))).toBe('not_checked');
  });

  it('formatea el reloj del recorrido', () => {
    expect(formatClock(95.4)).toBe('1:35');
    expect(formatClock(5)).toBe('0:05');
  });

  it('mide el tiempo desde el primer evento', () => {
    const events = [
      { sequence: 1, timestamp: '2026-11-23T18:11:49.019Z', type: 'assembly_started', data: null },
      { sequence: 2, timestamp: '2026-11-23T18:11:59.519Z', type: 'joint_attempt_failed', data: null },
    ];
    expect(secondsFromStart(events)).toEqual([0, 10.5]);
  });

  it('describe cada evento en castellano', () => {
    const failed = {
      sequence: 2, timestamp: '', type: 'joint_attempt_failed',
      data: { mortise: 'Table/Mortise_FL', reason: 'blocked' },
    };
    expect(eventDetail(failed)).toBe('Caja Table · FL · Bloqueada');
    const help = { sequence: 3, timestamp: '', type: 'help_viewed', data: { duration_seconds: 2.3 } };
    expect(eventDetail(help)).toBe('2,3 s');
  });
});
