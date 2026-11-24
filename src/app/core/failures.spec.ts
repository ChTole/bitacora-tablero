import { mortiseName, reasonName } from './failures';

describe('nombres de las fallas', () => {
  it('traduce los motivos', () => {
    expect(reasonName('position')).toBe('Posición');
    expect(reasonName('otro')).toBe('otro');
  });

  it('acorta los identificadores de las cajas', () => {
    expect(mortiseName('Table/Mortise_BR')).toBe('Table · BR');
    expect(mortiseName('Leg_A/Mortise_Rail')).toBe('Leg_A · Rail');
  });
});
