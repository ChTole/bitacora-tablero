import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { formatSessions } from '../../core/format';
import { StatsApi } from '../../core/stats-api';

@Component({
  selector: 'app-home',
  imports: [RouterLink, DatePipe],
  templateUrl: './home.html',
})
export class Home {
  protected readonly simulations = inject(StatsApi).simulations();
  protected readonly formatSessions = formatSessions;
}
