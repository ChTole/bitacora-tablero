import { Component, computed, input } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';

import { formatPercent } from '../core/format';
import { SessionCounts } from '../core/models';
import { BASE_OPTIONS, INIT_OPTS } from './base-options';
import { ChartCard } from './chart-card';
import { INK, SERIES } from './palette';

/** Dona: resultado de las sesiones cerradas (partes de un total, tres partes). */
@Component({
  selector: 'app-outcome-donut',
  imports: [NgxEchartsDirective, ChartCard],
  template: `
    <app-chart-card title="Resultado de las sesiones" note="Sesiones cerradas, según cómo terminaron" [columns]="['Resultado', 'Sesiones']" [rows]="rows()">
      @if (closed() > 0) {
        <div echarts class="chart" [options]="options()" [initOpts]="initOpts"></div>
      } @else {
        <p class="text-body-secondary">Todavía no hay sesiones cerradas.</p>
      }
    </app-chart-card>
  `,
})
export class OutcomeDonut {
  readonly sessions = input.required<SessionCounts>();
  protected readonly initOpts = INIT_OPTS;

  protected readonly parts = computed(() => {
    const outcomes = this.sessions().outcomes;
    return [
      { name: 'Correctas', value: outcomes.correct, color: SERIES.teal },
      { name: 'Con errores', value: outcomes.incorrect, color: SERIES.orange },
      { name: 'Sin comprobar', value: outcomes.not_checked, color: SERIES.plum },
    ];
  });

  protected readonly closed = computed(() => this.parts().reduce((sum, part) => sum + part.value, 0));
  protected readonly rows = computed(() => this.parts().map((part) => [part.name, String(part.value)]));

  protected readonly options = computed(() => {
    const closed = this.closed();
    const percent = (value: number) => formatPercent(closed ? (value / closed) * 100 : null, 0);
    const byName = new Map(this.parts().map((part) => [part.name, part.value]));
    return {
      ...BASE_OPTIONS,
      tooltip: {
        ...BASE_OPTIONS.tooltip,
        trigger: 'item',
        formatter: (p: { name: string; value: number }) => `${p.name}: ${p.value} (${percent(p.value)})`,
      },
      // Las etiquetas van en la leyenda, con su porcentaje: alrededor de la dona no entran en una tarjeta angosta
      legend: {
        ...BASE_OPTIONS.legend,
        top: 'bottom',
        left: 'center',
        formatter: (name: string) => `${name} · ${percent(byName.get(name) ?? 0)}`,
      },
      // Total en el centro
      title: {
        text: String(closed),
        subtext: 'cerradas',
        left: 'center',
        top: '33%',
        textStyle: { color: INK.primary, fontSize: 26, fontWeight: 'bold' },
        subtextStyle: { color: INK.muted, fontSize: 13 },
        itemGap: 2,
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '76%'],
          center: ['50%', '43%'],
          // 2 px de separación entre porciones, con extremos redondeados
          itemStyle: { borderColor: INK.surface, borderWidth: 2, borderRadius: 4 },
          label: { show: false },
          data: this.parts()
            .filter((part) => part.value > 0)
            .map((part) => ({ name: part.name, value: part.value, itemStyle: { color: part.color } })),
        },
      ],
    };
  });
}
