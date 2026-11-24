import { Component, computed, input } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';

import { formatPercent, formatRate } from '../../core/format';
import { Metrics } from '../../core/models';
import { BAR_END_VERTICAL, BASE_OPTIONS, CATEGORY_AXIS, INIT_OPTS, PERCENT_AXIS } from '../base-options';
import { ChartCard } from '../chart-card/chart-card';
import { INK, SERIES } from '../palette';

const toPercent = (rate: number | null) => (rate === null ? null : Math.round(rate * 1000) / 10);

/** Barras: resolución correcta con y sin consultar la ayuda (una sola serie, sin leyenda). */
@Component({
  selector: 'app-help-impact',
  imports: [NgxEchartsDirective, ChartCard],
  templateUrl: './help-impact.html',
})
export class HelpImpact {
  readonly metrics = input.required<Metrics>();
  protected readonly initOpts = INIT_OPTS;

  protected readonly rows = computed(() => [
    ['Con ayuda', formatRate(this.metrics().help.correct_rate_with_help)],
    ['Sin ayuda', formatRate(this.metrics().help.correct_rate_without_help)],
  ]);

  protected readonly options = computed(() => {
    const help = this.metrics().help;
    return {
      ...BASE_OPTIONS,
      legend: { show: false },
      tooltip: { ...BASE_OPTIONS.tooltip, trigger: 'item', valueFormatter: (v: number | null) => formatPercent(v) },
      grid: { top: 24, right: 8, bottom: 24, left: 48 },
      xAxis: { type: 'category', data: ['Con ayuda', 'Sin ayuda'], ...CATEGORY_AXIS },
      yAxis: { type: 'value', ...PERCENT_AXIS },
      series: [
        {
          name: 'Resolución correcta',
          type: 'bar',
          data: [toPercent(help.correct_rate_with_help), toPercent(help.correct_rate_without_help)],
          color: SERIES.teal,
          barMaxWidth: 40,
          itemStyle: { borderRadius: BAR_END_VERTICAL },
          label: { show: true, position: 'top', formatter: (p: { value: number | null }) => formatPercent(p.value), color: INK.secondary },
        },
      ],
    };
  });
}
