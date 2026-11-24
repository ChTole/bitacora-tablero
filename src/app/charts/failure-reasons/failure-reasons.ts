import { Component, computed, input } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';

import { REASONS, reasonName } from '../../core/failures';
import { formatPercent } from '../../core/format';
import { BAR_END_HORIZONTAL, BASE_OPTIONS, CATEGORY_AXIS, INIT_OPTS, VALUE_AXIS } from '../base-options';
import { ChartCard } from '../chart-card/chart-card';
import { INK, SERIES } from '../palette';

/** Barras horizontales: intentos fallidos por motivo, de mayor a menor (una sola serie). */
@Component({
  selector: 'app-failure-reasons',
  imports: [NgxEchartsDirective, ChartCard],
  templateUrl: './failure-reasons.html',
})
export class FailureReasons {
  readonly reasons = input.required<Record<string, number>>();
  protected readonly initOpts = INIT_OPTS;

  /** Los cuatro motivos siempre, de mayor a menor; los que no aparecen, en cero. */
  protected readonly items = computed(() => {
    const counts = this.reasons();
    const known = REASONS.map((reason) => ({ id: reason.id, count: counts[reason.id] ?? 0 }));
    const others = Object.entries(counts)
      .filter(([id]) => !REASONS.some((reason) => reason.id === id))
      .map(([id, count]) => ({ id, count }));
    return [...known, ...others].sort((a, b) => b.count - a.count);
  });

  protected readonly total = computed(() => this.items().reduce((sum, item) => sum + item.count, 0));
  protected readonly note = computed(() => `${this.total().toLocaleString('es-AR')} intentos en las sesiones cerradas`);
  protected readonly rows = computed(() =>
    this.items().map((item) => [
      reasonName(item.id),
      String(item.count),
      formatPercent(this.total() ? (item.count / this.total()) * 100 : null, 0),
    ]),
  );

  protected readonly options = computed(() => {
    const items = this.items();
    const total = this.total();
    return {
      ...BASE_OPTIONS,
      legend: { show: false },
      tooltip: {
        ...BASE_OPTIONS.tooltip,
        trigger: 'item',
        formatter: (p: { name: string; value: number }) =>
          `${p.name}: ${p.value} (${formatPercent((p.value / total) * 100, 0)})`,
      },
      grid: { top: 8, right: 48, bottom: 24, left: 96 },
      yAxis: { type: 'category', data: items.map((item) => reasonName(item.id)), inverse: true, ...CATEGORY_AXIS },
      xAxis: { type: 'value', minInterval: 1, ...VALUE_AXIS },
      series: [
        {
          name: 'Intentos fallidos',
          type: 'bar',
          data: items.map((item) => item.count),
          color: SERIES.teal,
          barMaxWidth: 22,
          itemStyle: { borderRadius: BAR_END_HORIZONTAL },
          label: { show: true, position: 'right', color: INK.secondary },
        },
      ],
    };
  });
}
