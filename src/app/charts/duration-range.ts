import { Component, computed, input } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';

import { formatSeconds } from '../core/format';
import { furnitureName } from '../core/furniture';
import { SummaryGroup } from '../core/models';
import { BAR_END_HORIZONTAL, BASE_OPTIONS, CATEGORY_AXIS, INIT_OPTS, VALUE_AXIS } from './base-options';
import { ChartCard } from './chart-card';
import { INK, SERIES } from './palette';

/**
 * Barras de rango: el tiempo típico de armado por mueble, del cuartil 25 al 75, con la mediana
 * marcada. Muestra lo habitual y cuánto varía, que un promedio esconde.
 */
@Component({
  selector: 'app-duration-range',
  imports: [NgxEchartsDirective, ChartCard],
  template: `
    <app-chart-card
      title="Tiempo de armado por mueble"
      note="Sesiones correctas. La barra va del 25 % al 75 % de los tiempos; la marca es la mediana."
      [columns]="['Mueble', 'Cuartil 25', 'Mediana', 'Cuartil 75', 'Sesiones']"
      [rows]="rows()"
    >
      @if (items().length) {
        <div echarts class="chart" [options]="options()" [initOpts]="initOpts"></div>
      } @else {
        <p class="text-body-secondary">Todavía no hay sesiones correctas.</p>
      }
    </app-chart-card>
  `,
})
export class DurationRange {
  readonly groups = input.required<SummaryGroup[]>();
  protected readonly initOpts = INIT_OPTS;

  /** Solo los muebles con al menos una sesión correcta. */
  protected readonly items = computed(() =>
    this.groups()
      .filter((group) => group.metrics.duration_seconds.median !== null)
      .map((group) => ({ name: furnitureName(String(group.key)), ...group.metrics.duration_seconds })),
  );

  protected readonly rows = computed(() =>
    this.items().map((item) => [
      item.name,
      formatSeconds(item.p25),
      formatSeconds(item.median),
      formatSeconds(item.p75),
      String(item.sessions),
    ]),
  );

  protected readonly options = computed(() => {
    const items = this.items();
    return {
      ...BASE_OPTIONS,
      legend: { show: false },
      tooltip: {
        ...BASE_OPTIONS.tooltip,
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: { dataIndex: number }[]) => {
          const item = items[params[0].dataIndex];
          return `<strong>${item.name}</strong><br>Mediana: ${formatSeconds(item.median)}<br>` +
            `Del ${formatSeconds(item.p25)} al ${formatSeconds(item.p75)}<br>${item.sessions} sesiones`;
        },
      },
      grid: { top: 8, right: 24, bottom: 28, left: 96 },
      yAxis: { type: 'category', data: items.map((item) => item.name), inverse: true, ...CATEGORY_AXIS },
      xAxis: {
        type: 'value',
        min: 0,
        ...VALUE_AXIS,
        axisLabel: { color: INK.muted, formatter: (value: number) => formatSeconds(value) },
      },
      series: [
        // Base invisible hasta el cuartil 25
        { type: 'bar', stack: 'range', data: items.map((item) => item.p25), itemStyle: { color: 'transparent' }, silent: true, barMaxWidth: 20 },
        // Rango del cuartil 25 al 75
        {
          name: 'Rango',
          type: 'bar',
          stack: 'range',
          data: items.map((item) => (item.p75 ?? 0) - (item.p25 ?? 0)),
          color: SERIES.teal,
          itemStyle: { borderRadius: BAR_END_HORIZONTAL, opacity: 0.85 },
          barMaxWidth: 20,
        },
        // Mediana
        {
          name: 'Mediana',
          type: 'scatter',
          data: items.map((item) => item.median),
          symbol: 'rect',
          symbolSize: [4, 28],
          itemStyle: { color: INK.primary, borderColor: INK.surface, borderWidth: 2 },
          z: 3,
        },
      ],
    };
  });
}
