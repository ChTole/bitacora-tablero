import { fillDays } from './timeline-chart';

describe('fillDays', () => {
  it('completa con ceros los días sin sesiones', () => {
    const days = fillDays([
      { date: '2026-11-28', sessions: 3, checked: 2, correct: 1 },
      { date: '2026-12-01', sessions: 1, checked: 1, correct: 1 },
    ]);
    expect(days.map((day) => day.date)).toEqual(['2026-11-28', '2026-11-29', '2026-11-30', '2026-12-01']);
    expect(days[1]).toEqual({ date: '2026-11-29', sessions: 0, checked: 0, correct: 0 });
  });

  it('sin datos, no inventa días', () => {
    expect(fillDays([])).toEqual([]);
  });
});
