import { Component, computed, input } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';

import { REASONS, mortiseName, reasonName } from '../../core/failures';
import { MortiseFailures } from '../../core/models';
import { BASE_OPTIONS, CATEGORY_AXIS, INIT_OPTS } from '../base-options';
import { ChartCard } from '../chart-card/chart-card';
import { INK, SEQUENTIAL } from '../palette';

/**
 * Mapa de calor: cajas (filas) por motivo de falla (columnas), para un mueble. Un solo tono, de claro
 * a oscuro: cuanto más oscura la celda, más intentos fallaron en esa caja por ese motivo.
 */
@Component({
  selector: 'app-mortise-heatmap',
  imports: [NgxEchartsDirective, ChartCard],
  templateUrl: './mortise-heatmap.html',
})
export class MortiseHeatmap {
  readonly mortises = input.required<MortiseFailures[]>();
  protected readonly initOpts = INIT_OPTS;

  /** Los motivos que aparecen en los datos, en el orden fijo de REASONS. */
  protected readonly reasons = computed(() => {
    const present = new Set(this.mortises().flatMap((m) => Object.keys(m.by_reason)));
    const ordered = REASONS.map((reason) => reason.id).filter((id) => present.has(id));
    return [...ordered, ...[...present].filter((id) => !ordered.includes(id as never))];
  });

  /** Una fila cada 36 px, para que las celdas no se aplasten con muchas cajas. */
  protected readonly height = computed(() => Math.max(220, this.mortises().length * 36 + 90));

  protected readonly columns = computed(() => ['Caja', ...this.reasons().map(reasonName), 'Total']);
  protected readonly rows = computed(() =>
    this.mortises().map((m) => [
      mortiseName(m.mortise),
      ...this.reasons().map((id) => String(m.by_reason[id] ?? 0)),
      String(m.failures),
    ]),
  );

  protected readonly options = computed(() => {
    const mortises = this.mortises();
    const reasons = this.reasons();
    const values = mortises.flatMap((m, row) => reasons.map((id, column) => [column, row, m.by_reason[id] ?? 0]));
    const max = Math.max(1, ...values.map((value) => value[2]));
    // Texto blanco sobre las celdas oscuras y oscuro sobre las claras, para que siempre se lea
    const cells = values.map((value) => ({
      value,
      label: { color: value[2] > max * 0.45 ? INK.surface : INK.primary },
    }));
    return {
      ...BASE_OPTIONS,
      legend: { show: false },
      tooltip: {
        ...BASE_OPTIONS.tooltip,
        trigger: 'item',
        formatter: (p: { value: number[] }) =>
          `<strong>${mortiseName(mortises[p.value[1]].mortise)}</strong><br>${reasonName(reasons[p.value[0]])}: ${p.value[2]} intentos`,
      },
      grid: { top: 8, right: 8, bottom: 56, left: 120 },
      xAxis: { type: 'category', data: reasons.map(reasonName), position: 'top', ...CATEGORY_AXIS, splitArea: { show: false } },
      yAxis: { type: 'category', data: mortises.map((m) => mortiseName(m.mortise)), inverse: true, ...CATEGORY_AXIS },
      // Referencia de la escala, debajo del gráfico
      visualMap: {
        min: 0,
        max,
        calculable: false,
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        itemHeight: 140,
        itemWidth: 10,
        text: [String(max), '0'],
        textStyle: { color: INK.muted },
        inRange: { color: SEQUENTIAL },
      },
      series: [
        {
          type: 'heatmap',
          data: cells,
          // 2 px de separación entre celdas
          itemStyle: { borderColor: INK.surface, borderWidth: 2, borderRadius: 4 },
          label: { show: true, formatter: (p: { value: number[] }) => (p.value[2] ? String(p.value[2]) : '') },
          emphasis: { itemStyle: { borderColor: INK.primary, borderWidth: 2 } },
        },
      ],
    };
  });
}
