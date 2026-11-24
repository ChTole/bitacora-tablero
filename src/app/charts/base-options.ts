import { INK } from './palette';

/** Opciones comunes de todos los gráficos: tipografía, tooltip, accesibilidad y animación sobria. */
export const BASE_OPTIONS = {
  textStyle: { fontFamily: 'Lato, "Segoe UI", system-ui, sans-serif', color: INK.secondary },
  aria: { enabled: true },
  animationDuration: 400,
  tooltip: {
    backgroundColor: INK.surface,
    borderColor: INK.axis,
    borderWidth: 1,
    textStyle: { color: INK.primary, fontSize: 13 },
    extraCssText: 'box-shadow: 0 2px 8px rgba(43, 74, 87, 0.15);',
  },
  legend: {
    top: 0,
    left: 0,
    icon: 'roundRect',
    itemWidth: 12,
    itemHeight: 12,
    textStyle: { color: INK.secondary },
  },
};

/** Eje de categorías: línea base visible, sin grilla. */
export const CATEGORY_AXIS = {
  axisLine: { lineStyle: { color: INK.axis } },
  axisTick: { show: false },
  axisLabel: { color: INK.muted },
};

/** Eje de valores: sin línea, con grilla tenue. */
export const VALUE_AXIS = {
  axisLine: { show: false },
  axisLabel: { color: INK.muted },
  splitLine: { lineStyle: { color: INK.grid } },
};

/** Extremo redondeado de 4 px en el extremo de la barra, no en la base. */
export const BAR_END_VERTICAL = [4, 4, 0, 0];
export const BAR_END_HORIZONTAL = [0, 4, 4, 0];

/** Escala de porcentajes de 0 a 100. */
export const PERCENT_AXIS = {
  ...VALUE_AXIS,
  min: 0,
  max: 100,
  axisLabel: { color: INK.muted, formatter: '{value} %' },
};

export const INIT_OPTS = { locale: 'ES', renderer: 'canvas' as const };
