/**
 * ECharts con solo los módulos que usa el tablero (tree shaking): la build queda mucho más liviana
 * que importando 'echarts' completo. Al sumar un tipo de gráfico, se registra acá.
 */
import { BarChart, BoxplotChart, HeatmapChart, LineChart, PieChart, ScatterChart } from 'echarts/charts';
import {
  AriaComponent,
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
// @ts-expect-error: ECharts no publica tipos para sus archivos de idioma
import langES from 'echarts/i18n/langES-obj.js';

// Textos propios de ECharts (descripciones de accesibilidad, por ejemplo) en castellano
echarts.registerLocale('ES', langES);

echarts.use([
  BarChart,
  BoxplotChart,
  HeatmapChart,
  LineChart,
  PieChart,
  ScatterChart,
  AriaComponent,
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
  CanvasRenderer,
]);

export { echarts };
