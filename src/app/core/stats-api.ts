import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { Filters, GroupBy, SimulationList, Summary } from './models';

const BASE = `${environment.apiBaseUrl}/stats/v1`;

/** Parámetros de la URL: se omiten los filtros vacíos. */
export function toParams(filters: Filters, extra: Record<string, string> = {}): Record<string, string> {
  const params: Record<string, string> = { ...extra };
  for (const [key, value] of Object.entries(filters)) {
    if (value !== null && value !== undefined && value !== '') {
      params[key] = String(value);
    }
  }
  return params;
}

/**
 * Acceso a la API del tablero con httpResource: cada consulta es una señal que se vuelve a pedir
 * sola cuando cambian sus parámetros (por ejemplo, los filtros).
 */
@Injectable({ providedIn: 'root' })
export class StatsApi {
  simulations() {
    return httpResource<SimulationList>(() => `${BASE}/simulations`);
  }

  summary(simulationId: () => string, filters: () => Filters, groupBy?: () => GroupBy | null) {
    return httpResource<Summary>(() => {
      const group = groupBy?.();
      return {
        url: `${BASE}/simulations/${simulationId()}/summary`,
        params: toParams(filters(), group ? { group_by: group } : {}),
      };
    });
  }
}
