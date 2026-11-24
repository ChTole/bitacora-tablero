import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import { SessionJourney } from '../../charts/session-journey';
import { formatSeconds } from '../../core/format';
import { furnitureName } from '../../core/furniture';
import { sessionOutcome } from '../../core/sessions';
import { StatsApi } from '../../core/stats-api';
import { OutcomeBadge } from '../sessions/outcome-badge';

@Component({
  selector: 'app-session-detail',
  imports: [RouterLink, DatePipe, OutcomeBadge, SessionJourney],
  templateUrl: './session-detail.html',
})
export class SessionDetailPage {
  private readonly title = inject(Title);

  readonly simulationId = input.required<string>();
  readonly sessionId = input.required<string>();

  protected readonly session = inject(StatsApi).session(this.simulationId, this.sessionId);
  protected readonly notFound = computed(() => {
    const error = this.session.error() as { status?: number } | undefined;
    return error?.status === 404;
  });

  protected readonly outcome = sessionOutcome;
  protected readonly furnitureName = furnitureName;
  protected readonly formatSeconds = formatSeconds;

  constructor() {
    effect(() => {
      const alias = this.session.hasValue() ? this.session.value().alias : 'Sesión';
      this.title.setTitle(`Bitácora · ${alias}`);
    });
  }
}
