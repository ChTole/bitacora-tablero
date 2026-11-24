import { Component, computed, input } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';

import { mortiseName, reasonName } from '../core/failures';
import { SessionEvent } from '../core/models';
import { eventName, formatClock } from '../core/sessions';
import { BASE_OPTIONS, CATEGORY_AXIS, INIT_OPTS, VALUE_AXIS } from './base-options';
import { ChartCard } from './chart-card';
import { INK, SERIES } from './palette';

/** Carriles del recorrido, de arriba abajo. */
const LANES = ['Inicio y fin', 'Uniones', 'Intentos fallidos', 'Ayuda y controles'];

/** Cada tipo de evento: carril, serie, color y forma. La forma es una segunda señal además del color. */
const KINDS: Record<string, { lane: number; series: string; color: string; symbol: string }> = {
  assembly_started: { lane: 0, series: 'Inicio, fin y pausas', color: INK.muted, symbol: 'emptyCircle' },
  assembly_checked: { lane: 0, series: 'Inicio, fin y pausas', color: INK.muted, symbol: 'emptyCircle' },
  assembly_abandoned: { lane: 0, series: 'Inicio, fin y pausas', color: INK.muted, symbol: 'emptyCircle' },
  session_paused: { lane: 0, series: 'Inicio, fin y pausas', color: INK.muted, symbol: 'emptyCircle' },
  session_resumed: { lane: 0, series: 'Inicio, fin y pausas', color: INK.muted, symbol: 'emptyCircle' },
  joint_completed: { lane: 1, series: 'Unión', color: SERIES.teal, symbol: 'circle' },
  joint_undone: { lane: 1, series: 'Unión deshecha', color: SERIES.plum, symbol: 'diamond' },
  joint_attempt_failed: { lane: 2, series: 'Intento fallido', color: SERIES.orange, symbol: 'triangle' },
  help_viewed: { lane: 3, series: 'Ayuda y controles', color: INK.primary, symbol: 'rect' },
  controls_viewed: { lane: 3, series: 'Ayuda y controles', color: INK.primary, symbol: 'rect' },
};

/** Orden fijo de las series en la leyenda, sin importar qué evento aparece primero. */
const SERIES_ORDER = ['Unión', 'Unión deshecha', 'Intento fallido', 'Ayuda y controles', 'Inicio, fin y pausas'];

/** Segundos desde el primer evento, según el reloj del dispositivo (incluye las pausas). */
export function secondsFromStart(events: SessionEvent[]): number[] {
  if (events.length === 0) return [];
  const start = Date.parse(events[0].timestamp);
  return events.map((event) => (Date.parse(event.timestamp) - start) / 1000);
}

/** Detalle legible de un evento, para el tooltip y la tabla. */
export function eventDetail(event: SessionEvent): string {
  const data = (event.data ?? {}) as Record<string, unknown>;
  const parts: string[] = [];
  if (typeof data['mortise'] === 'string') parts.push(`Caja ${mortiseName(data['mortise'])}`);
  if (typeof data['reason'] === 'string') parts.push(reasonName(data['reason']));
  if (data['expected'] === false) parts.push('no es la unión esperada');
  if (data['mode'] === 'detach') parts.push('pieza quitada');
  if (typeof data['duration_seconds'] === 'number' && event.type.endsWith('_viewed')) {
    parts.push(`${data['duration_seconds'].toLocaleString('es-AR')} s`);
  }
  return parts.join(' · ');
}

/** Dispersión: cada evento en su momento, en el carril de su tipo. */
@Component({
  selector: 'app-session-journey',
  imports: [NgxEchartsDirective, ChartCard],
  template: `
    <app-chart-card
      title="Recorrido de la sesión"
      note="Cada evento en el momento en que ocurrió, desde el inicio del armado."
      [columns]="['Tiempo', 'Evento', 'Detalle']"
      [rows]="rows()"
    >
      <div echarts class="chart" [options]="options()" [initOpts]="initOpts"></div>
    </app-chart-card>
  `,
})
export class SessionJourney {
  readonly events = input.required<SessionEvent[]>();
  protected readonly initOpts = INIT_OPTS;

  protected readonly seconds = computed(() => secondsFromStart(this.events()));
  protected readonly rows = computed(() =>
    this.events().map((event, i) => [formatClock(this.seconds()[i]), eventName(event.type), eventDetail(event)]),
  );

  protected readonly options = computed(() => {
    const events = this.events();
    const seconds = this.seconds();
    const bySeries = new Map<string, { color: string; symbol: string; data: object[] }>();
    events.forEach((event, i) => {
      const kind = KINDS[event.type];
      if (!kind) return;
      const series = bySeries.get(kind.series) ?? { color: kind.color, symbol: kind.symbol, data: [] };
      series.data.push({ value: [seconds[i], kind.lane], event, time: seconds[i] });
      bySeries.set(kind.series, series);
    });

    return {
      ...BASE_OPTIONS,
      tooltip: {
        ...BASE_OPTIONS.tooltip,
        trigger: 'item',
        formatter: (p: { data: { event: SessionEvent; time: number } }) => {
          const detail = eventDetail(p.data.event);
          return `<strong>${eventName(p.data.event.type)}</strong> · ${formatClock(p.data.time)}${detail ? `<br>${detail}` : ''}`;
        },
      },
      grid: { top: 40, right: 24, bottom: 32, left: 130 },
      xAxis: {
        type: 'value',
        min: 0,
        ...VALUE_AXIS,
        axisLabel: { color: INK.muted, formatter: (value: number) => formatClock(value) },
      },
      yAxis: {
        type: 'category',
        data: LANES,
        inverse: true,
        ...CATEGORY_AXIS,
        splitLine: { show: true, lineStyle: { color: INK.grid } },
      },
      series: SERIES_ORDER.filter((name) => bySeries.has(name)).map((name) => {
        const series = bySeries.get(name)!;
        const hollow = series.symbol === 'emptyCircle';
        return {
          name,
          type: 'scatter',
          data: series.data,
          color: series.color,
          symbol: series.symbol,
          symbolSize: 12,
          // Aro de 2 px del color de fondo para separar marcas superpuestas; el círculo vacío usa su propio borde
          itemStyle: hollow ? { borderWidth: 2 } : { borderColor: INK.surface, borderWidth: 2 },
        };
      }),
    };
  });
}
