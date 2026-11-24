/** Respuestas de la API del tablero. Ver bitacora-api/docs/api-tablero.md. */

export interface SimulationItem {
  simulation_id: string;
  name: string;
  sessions: number;
  last_session_at: string | null;
}

export interface SimulationList {
  simulations: SimulationItem[];
}

export interface Filters {
  furniture_id?: string | null;
  mobile?: boolean | null;
  app_version?: string | null;
  from?: string | null;
  to?: string | null;
}

export interface Quartiles {
  median: number | null;
  p25: number | null;
  p75: number | null;
  sessions: number;
}

export interface SessionCounts {
  total: number;
  active: number;
  completed: number;
  abandoned: number;
  outcomes: { correct: number; incorrect: number; not_checked: number };
}

export interface Metrics {
  finish_rate: number | null;
  correct_rate: number | null;
  duration_seconds: Quartiles;
  failed_attempts: Quartiles;
  failures_by_reason: Record<string, number>;
  help: {
    usage_rate: number | null;
    median_seconds: number | null;
    correct_rate_with_help: number | null;
    correct_rate_without_help: number | null;
  };
  inconsistent_sessions: number;
}

export interface SummaryGroup {
  key: string | boolean;
  sessions: SessionCounts;
  metrics: Metrics;
}

export interface Summary {
  simulation_id: string;
  filters: Required<Filters>;
  generated_at: string;
  sessions: SessionCounts;
  metrics: Metrics;
  groups?: SummaryGroup[];
}

export type GroupBy = 'furniture_id' | 'mobile' | 'app_version';

export interface TimelineDay {
  date: string;
  sessions: number;
  checked: number;
  correct: number;
}

export interface Timeline {
  simulation_id: string;
  tz: string;
  days: TimelineDay[];
}

export interface MortiseFailures {
  mortise: string;
  failures: number;
  sessions: number;
  by_reason: Record<string, number>;
}

export interface Failures {
  simulation_id: string;
  mortises: MortiseFailures[];
}
