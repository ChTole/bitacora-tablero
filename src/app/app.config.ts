import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideAppInitializer, provideBrowserGlobalErrorListeners, inject } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideEchartsCore } from 'ngx-echarts';

import { routes } from './app.routes';
import { ServerStatus } from './core/server-status';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    // ECharts se descarga recién cuando una página muestra el primer gráfico
    provideEchartsCore({ echarts: () => import('./charts/echarts-setup').then((m) => m.echarts) }),
    // Despierta la API apenas carga la página, sin esperar la respuesta para mostrar el tablero
    provideAppInitializer(() => {
      void inject(ServerStatus).wakeUp();
    }),
  ],
};
