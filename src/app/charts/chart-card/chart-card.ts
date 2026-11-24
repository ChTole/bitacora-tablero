import { Component, input } from '@angular/core';

/**
 * Tarjeta de un gráfico: título, nota con la cantidad de sesiones detrás del dato y, debajo,
 * los mismos valores como tabla, para quien no puede o no quiere leer el gráfico.
 */
@Component({
  selector: 'app-chart-card',
  templateUrl: './chart-card.html',
})
export class ChartCard {
  readonly title = input.required<string>();
  readonly note = input<string>('');
  readonly columns = input<string[]>([]);
  readonly rows = input<string[][]>([]);
}
