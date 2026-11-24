import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { Failures, Filters, GroupBy, SessionDetail, SessionPage, SimulationList, Summary, Timeline } from './models';

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

  timeline(simulationId: () => string, filters: () => Filters, tz: string) {
    return httpResource<Timeline>(() => ({
      url: `${BASE}/simulations/${simulationId()}/timeline`,
      params: toParams(filters(), { tz }),
    }));
  }

  failures(simulationId: () => string, filters: () => Filters) {
    return httpResource<Failures>(() => ({
      url: `${BASE}/simulations/${simulationId()}/failures`,
      params: toParams(filters()),
    }));
  }

  sessions(simulationId: () => string, query: () => { alias?: string; before?: string | null; limit?: number }) {
    return httpResource<SessionPage>(() => {
      const { alias, before, limit } = query();
      return {
        url: `${BASE}/simulations/${simulationId()}/sessions`,
        params: toParams({}, {
          ...(alias ? { alias } : {}),
          ...(before ? { before } : {}),
          limit: String(limit ?? 20),
        }),
      };
    });
  }

  session(simulationId: () => string, id: () => string) {
    return httpResource<SessionDetail>(() => `${BASE}/simulations/${simulationId()}/sessions/${id()}`);
  }
}
