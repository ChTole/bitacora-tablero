import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import { DurationRange } from '../../charts/duration-range';
import { FailureReasons } from '../../charts/failure-reasons';
import { MortiseHeatmap } from '../../charts/mortise-heatmap';
import { FurnitureRates } from '../../charts/furniture-rates';
import { HelpImpact } from '../../charts/help-impact';
import { OutcomeDonut } from '../../charts/outcome-donut';
import { TimelineChart } from '../../charts/timeline-chart';

import { formatRate, formatSeconds, formatSessions } from '../../core/format';
import { FURNITURE } from '../../core/furniture';
import { Filters } from '../../core/models';
import { StatsApi } from '../../core/stats-api';

type Device = 'all' | 'desktop' | 'mobile';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, OutcomeDonut, TimelineChart, FurnitureRates, DurationRange, HelpImpact, FailureReasons, MortiseHeatmap],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private readonly api = inject(StatsApi);
  private readonly title = inject(Title);

  /** Parámetro de la ruta (/:simulationId). */
  readonly simulationId = input.required<string>();

  // Filtros
  protected readonly furniture = signal('');
  protected readonly device = signal<Device>('all');
  protected readonly from = signal('');
  protected readonly to = signal('');

  protected readonly filters = computed<Filters>(() => ({
    furniture_id: this.furniture() || null,
    mobile: this.device() === 'all' ? null : this.device() === 'mobile',
    from: this.from() || null,
    to: this.to() || null,
  }));

  /**
   * Cada mueble tiene sus propias cajas: el mapa de calor siempre muestra uno. Usa el del filtro o,
   * si el filtro está en "Todos", el que se elige dentro de la tarjeta.
   */
  protected readonly heatmapChoice = signal<string>(FURNITURE[0].id);
  protected readonly heatmapFurniture = computed(() => this.furniture() || this.heatmapChoice());

  protected readonly simulations = this.api.simulations();
  protected readonly summary = this.api.summary(this.simulationId, this.filters);
  protected readonly byFurniture = this.api.summary(this.simulationId, this.filters, () => 'furniture_id');
  /** Los días se agrupan en la zona horaria de quien mira el tablero. */
  protected readonly timeline = this.api.timeline(
    this.simulationId,
    this.filters,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );

  protected readonly failures = this.api.failures(this.simulationId, () => ({
    ...this.filters(),
    furniture_id: this.heatmapFurniture(),
  }));

  // value() lanza un error si la consulta falló: hasValue() permite mostrar el resto del tablero igual
  protected readonly timelineDays = computed(() => (this.timeline.hasValue() ? this.timeline.value().days : []));
  protected readonly mortises = computed(() => (this.failures.hasValue() ? this.failures.value().mortises : []));
  protected readonly furnitureGroups = computed(() =>
    this.byFurniture.hasValue() ? (this.byFurniture.value().groups ?? []) : [],
  );

  protected readonly simulationName = computed(
    () =>
      (this.simulations.hasValue() ? this.simulations.value().simulations : []).find((s) => s.simulation_id === this.simulationId())?.name ??
      this.simulationId(),
  );

  protected readonly furnitureOptions = FURNITURE;
  protected readonly formatRate = formatRate;
  protected readonly formatSeconds = formatSeconds;
  protected readonly formatSessions = formatSessions;

  constructor() {
    effect(() => this.title.setTitle(`Bitácora · ${this.simulationName()}`));
  }

  protected clearFilters(): void {
    this.furniture.set('');
    this.device.set('all');
    this.from.set('');
    this.to.set('');
  }
}
