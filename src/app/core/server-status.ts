import { Injectable, signal } from '@angular/core';

import { environment } from '../../environments/environment';

export type ServerState = 'checking' | 'waking' | 'ready' | 'unreachable';

/** Segundos de espera antes de avisar que el servidor se está activando. */
const WAKING_AFTER_MS = 2500;
/** El arranque en frío de Render tarda alrededor de un minuto. */
const GIVE_UP_AFTER_MS = 90_000;

/**
 * Estado del servidor. El plan gratuito de Render apaga la API sin tráfico: la primera consulta
 * puede tardar un minuto. Al iniciar, el tablero la despierta con /healthz y avisa si demora.
 */
@Injectable({ providedIn: 'root' })
export class ServerStatus {
  readonly state = signal<ServerState>('checking');

  async wakeUp(): Promise<void> {
    const waking = setTimeout(() => this.state.set('waking'), WAKING_AFTER_MS);
    try {
      // /healthz no envía encabezados CORS: con 'no-cors', el navegador no bloquea la respuesta,
      // aunque no deja leer su contenido. Para despertar el servidor alcanza con que responda.
      await fetch(`${environment.apiBaseUrl}/healthz`, {
        mode: 'no-cors',
        signal: AbortSignal.timeout(GIVE_UP_AFTER_MS),
      });
      this.state.set('ready');
    } catch {
      this.state.set('unreachable');
    } finally {
      clearTimeout(waking);
    }
  }
}