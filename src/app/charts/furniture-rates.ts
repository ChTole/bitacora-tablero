import { Component, computed, input } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';

import { formatPercent, formatRate } from '../core/format';
import { furnitureName } from '../core/furniture';
import { SummaryGroup } from '../core/models';
import { BAR_END_VERTICAL, BASE_OPTIONS, CATEGORY_AXIS, INIT_OPTS, PERCENT_AXIS } from './base-options';
import { ChartCard } from './chart-card';
import { INK, SERIES } from './palette';

const toPercent = (rate: number | null) => (rate === null ? null : Math.round(rate * 1000) / 10);

/** Barras agrupadas: finalización y resolución correcta por mueble. */
@Component({
  selector: 'app-furniture-rates',
  imports: [NgxEchartsDirective, ChartCard],
  template: `
    <app-chart-card
      title="Finalización y resolución por mueble"
      note="Finalización: sobre las sesiones cerradas. Resolución correcta: sobre las comprobadas."
      [columns]="['Mueble', 'Finalización', 'Resolución correcta', 'Sesiones']"
      [rows]="rows()"
    >
      @if (groups().length) {
        <div echarts class="chart" [options]="options()" [initOpts]="initOpts"></div>
      } @else {
        <p class="text-body-secondary">Todavía no hay sesiones con mueble.</p>
      }
    </app-chart-card>
  `,
})
export class FurnitureRates {
  readonly groups = input.required<SummaryGroup[]>();
  protected readonly initOpts = INIT_OPTS;

  protected readonly rows = computed(() =>
    this.groups().map((group) => [
      furnitureName(String(group.key)),
      formatRate(group.metrics.finish_rate),
      formatRate(group.metrics.correct_rate),
      String(group.sessions.total),
    ]),
  );

  protected readonly options = computed(() => {
    const groups = this.groups();
    const bar = (name: string, color: string, values: (number | null)[]) => ({
      name,
      type: 'bar',
      data: values,
      color,
      barMaxWidth: 28,
      barGap: '10%',
      itemStyle: { borderRadius: BAR_END_VERTICAL },
      label: { show: true, position: 'top', formatter: (p: { value: number | null }) => formatPercent(p.value), color: INK.secondary, fontSize: 12 },
    });
    return {
      ...BASE_OPTIONS,
      tooltip: { ...BASE_OPTIONS.tooltip, trigger: 'axis', axisPointer: { type: 'shadow' }, valueFormatter: (v: number | null) => formatPercent(v) },
      grid: { top: 48, right: 8, bottom: 24, left: 48 },
      xAxis: { type: 'category', data: groups.map((group) => furnitureName(String(group.key))), ...CATEGORY_AXIS },
      yAxis: { type: 'value', ...PERCENT_AXIS },
      series: [
        bar('Finalización', SERIES.orange, groups.map((group) => toPercent(group.metrics.finish_rate))),
        bar('Resolución correcta', SERIES.teal, groups.map((group) => toPercent(group.metrics.correct_rate))),
      ],
    };
  });
}
