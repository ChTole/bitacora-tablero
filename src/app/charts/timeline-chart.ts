import { Component, computed, input } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';

import { TimelineDay } from '../core/models';
import { BASE_OPTIONS, CATEGORY_AXIS, INIT_OPTS, VALUE_AXIS } from './base-options';
import { ChartCard } from './chart-card';
import { SERIES } from './palette';

const DAY_MS = 86_400_000;

/** La API omite los días sin sesiones: el gráfico los completa con ceros. */
export function fillDays(days: TimelineDay[]): TimelineDay[] {
  if (days.length === 0) return [];
  const byDate = new Map(days.map((day) => [day.date, day]));
  const result: TimelineDay[] = [];
  const last = Date.parse(`${days[days.length - 1].date}T00:00:00Z`);
  for (let time = Date.parse(`${days[0].date}T00:00:00Z`); time <= last; time += DAY_MS) {
    const date = new Date(time).toISOString().slice(0, 10);
    result.push(byDate.get(date) ?? { date, sessions: 0, checked: 0, correct: 0 });
  }
  return result;
}

/** "2026-11-24" → "24/11" */
function shortDate(date: string): string {
  const [, month, day] = date.split('-');
  return `${Number(day)}/${Number(month)}`;
}

/** Líneas: sesiones, comprobadas y correctas por día. */
@Component({
  selector: 'app-timeline-chart',
  imports: [NgxEchartsDirective, ChartCard],
  template: `
    <app-chart-card
      title="Sesiones por día"
      note="Por fecha de inicio, en tu zona horaria"
      [columns]="['Día', 'Sesiones', 'Comprobadas', 'Correctas']"
      [rows]="rows()"
    >
      @if (filled().length) {
        <div echarts class="chart" [options]="options()" [initOpts]="initOpts"></div>
      } @else {
        <p class="text-body-secondary">Todavía no hay sesiones en este período.</p>
      }
    </app-chart-card>
  `,
})
export class TimelineChart {
  readonly days = input.required<TimelineDay[]>();
  protected readonly initOpts = INIT_OPTS;

  protected readonly filled = computed(() => fillDays(this.days()));
  protected readonly rows = computed(() =>
    this.filled().map((day) => [shortDate(day.date), String(day.sessions), String(day.checked), String(day.correct)]),
  );

  protected readonly options = computed(() => {
    const days = this.filled();
    const line = (name: string, color: string, values: number[]) => ({
      name,
      type: 'line',
      data: values,
      color,
      lineStyle: { width: 2 },
      symbol: 'circle',
      symbolSize: 8,
      // Con un solo día, una línea no se ve: los puntos sí
      showSymbol: true,
      itemStyle: { borderColor: '#ffffff', borderWidth: 2 },
    });
    return {
      ...BASE_OPTIONS,
      tooltip: { ...BASE_OPTIONS.tooltip, trigger: 'axis', axisPointer: { type: 'line' } },
      grid: { top: 40, right: 16, bottom: 24, left: 40 },
      xAxis: { type: 'category', data: days.map((day) => shortDate(day.date)), boundaryGap: false, ...CATEGORY_AXIS },
      yAxis: { type: 'value', minInterval: 1, ...VALUE_AXIS },
      series: [
        line('Sesiones', SERIES.plum, days.map((day) => day.sessions)),
        line('Comprobadas', SERIES.orange, days.map((day) => day.checked)),
        line('Correctas', SERIES.teal, days.map((day) => day.correct)),
      ],
    };
  });
}
