import { Component, input } from '@angular/core';

/**
 * Tarjeta de un gráfico: título, nota con la cantidad de sesiones detrás del dato y, debajo,
 * los mismos valores como tabla, para quien no puede o no quiere leer el gráfico.
 */
@Component({
  selector: 'app-chart-card',
  template: `
    <div class="card h-100 shadow-sm">
      <div class="card-body d-flex flex-column">
        <h3 class="h6 mb-1">{{ title() }}</h3>
        @if (note()) {
          <p class="kpi-note mb-2">{{ note() }}</p>
        }
        <div class="flex-grow-1"><ng-content /></div>
        @if (rows().length) {
          <details class="mt-2 small">
            <summary class="text-body-secondary">Ver como tabla</summary>
            <table class="table table-sm mt-2 mb-0">
              <thead>
                <tr>
                  @for (column of columns(); track $index) {
                    <th scope="col">{{ column }}</th>
                  }
                </tr>
              </thead>
              <tbody>
                @for (row of rows(); track $index) {
                  <tr>
                    @for (cell of row; track $index) {
                      <td>{{ cell }}</td>
                    }
                  </tr>
                }
              </tbody>
            </table>
          </details>
        }
      </div>
    </div>
  `,
})
export class ChartCard {
  readonly title = input.required<string>();
  readonly note = input<string>('');
  readonly columns = input<string[]>([]);
  readonly rows = input<string[][]>([]);
}
