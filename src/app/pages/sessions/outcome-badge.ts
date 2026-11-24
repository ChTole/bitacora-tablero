import { Component, computed, input } from '@angular/core';

import { SERIES } from '../../charts/palette';
import { OUTCOME_LABELS, Outcome } from '../../core/sessions';

const COLORS: Record<Outcome, string> = { correct: SERIES.teal, incorrect: SERIES.orange, not_checked: SERIES.plum };

/** Resultado con un punto de color y el texto: el color nunca es la única señal. */
@Component({
  selector: 'app-outcome-badge',
  templateUrl: './outcome-badge.html',
})
export class OutcomeBadge {
  readonly outcome = input.required<Outcome>();
  protected readonly color = computed(() => COLORS[this.outcome()]);
  protected readonly label = computed(() => OUTCOME_LABELS[this.outcome()]);
}
