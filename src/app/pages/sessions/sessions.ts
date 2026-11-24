import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';

import { formatSeconds } from '../../core/format';
import { furnitureName } from '../../core/furniture';
import { sessionOutcome } from '../../core/sessions';
import { StatsApi } from '../../core/stats-api';
import { OutcomeBadge } from './outcome-badge';

const PAGE_SIZE = 20;

@Component({
  selector: 'app-sessions',
  imports: [RouterLink, DatePipe, OutcomeBadge],
  templateUrl: './sessions.html',
})
export class Sessions {
  private readonly api = inject(StatsApi);
  private readonly router = inject(Router);

  /** Parámetro de la ruta. */
  readonly simulationId = input.required<string>();
  /** Parámetro de la URL (?alias=...): permite enlazar directamente a la búsqueda. */
  readonly alias = input<string>();

  /** Páginas: cada cursor es el "next" de la página anterior. */
  private readonly cursors = signal<(string | null)[]>([null]);
  protected readonly page = computed(() => this.cursors().length);

  protected readonly result = this.api.sessions(this.simulationId, () => ({
    alias: this.alias()?.trim() || undefined,
    before: this.cursors().at(-1),
    limit: PAGE_SIZE,
  }));
  protected readonly sessions = computed(() => (this.result.hasValue() ? this.result.value().sessions : []));
  protected readonly next = computed(() => (this.result.hasValue() ? this.result.value().next : null));

  protected readonly outcome = sessionOutcome;
  protected readonly furnitureName = furnitureName;
  protected readonly formatSeconds = formatSeconds;

  constructor() {
    inject(Title).setTitle('Bitácora · Sesiones');
    // Una búsqueda nueva vuelve a la primera página
    effect(() => {
      this.alias();
      this.cursors.set([null]);
    });
  }

  protected search(text: string): void {
    void this.router.navigate([], { queryParams: { alias: text.trim() || null } });
  }

  protected nextPage(): void {
    const next = this.next();
    if (next) this.cursors.update((cursors) => [...cursors, next]);
  }

  protected previousPage(): void {
    this.cursors.update((cursors) => (cursors.length > 1 ? cursors.slice(0, -1) : cursors));
  }
}
