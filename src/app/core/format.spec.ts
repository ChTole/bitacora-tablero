import { formatPercent, formatRate, formatSeconds, formatSessions } from './format';
import { furnitureName } from './furniture';
import { toParams } from './stats-api';

describe('formatos', () => {
  it('formatea proporciones como porcentaje', () => {
    expect(formatRate(0.746)).toBe('74,6 %');
    expect(formatRate(1)).toBe('100 %');
    expect(formatRate(null)).toBe('—');
  });

  it('formatea segundos en minutos y segundos', () => {
    expect(formatSeconds(166.3)).toBe('2 min 46 s');
    expect(formatSeconds(45)).toBe('45 s');
    expect(formatSeconds(120)).toBe('2 min');
    expect(formatSeconds(null)).toBe('—');
  });

  it('formatea porcentajes con coma decimal', () => {
    expect(formatPercent(71.2)).toBe('71,2 %');
    expect(formatPercent(10.66, 0)).toBe('11 %');
    expect(formatPercent(null)).toBe('—');
  });

  it('usa singular y plural', () => {
    expect(formatSessions(1)).toBe('1 sesión');
    expect(formatSessions(1234)).toBe('1.234 sesiones');
  });

  it('traduce los identificadores de los muebles', () => {
    expect(furnitureName('stool')).toBe('Taburete');
    expect(furnitureName('otro')).toBe('otro');
    expect(furnitureName(null)).toBe('Sin dato');
  });

  it('omite los filtros vacíos en la URL', () => {
    expect(toParams({ furniture_id: 'chair', mobile: false, from: null, to: '' }, { group_by: 'mobile' })).toEqual({
      group_by: 'mobile',
      furniture_id: 'chair',
      mobile: 'false',
    });
  });
});
