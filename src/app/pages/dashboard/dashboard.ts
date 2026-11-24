import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import { formatRate, formatSeconds, formatSessions } from '../../core/format';
import { FURNITURE } from '../../core/furniture';
import { Filters } from '../../core/models';
import { StatsApi } from '../../core/stats-api';

type Device = 'all' | 'desktop' | 'mobile';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
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

  protected readonly simulations = this.api.simulations();
  protected readonly summary = this.api.summary(this.simulationId, this.filters);

  protected readonly simulationName = computed(
    () =>
      this.simulations.value()?.simulations.find((s) => s.simulation_id === this.simulationId())?.name ??
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
