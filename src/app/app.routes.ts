import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Bitácora · Tablero',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: ':simulationId',
    loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: ':simulationId/sesiones',
    title: 'Bitácora · Sesiones',
    loadComponent: () => import('./pages/sessions/sessions').then((m) => m.Sessions),
  },
  {
    path: ':simulationId/sesiones/:sessionId',
    loadComponent: () => import('./pages/session-detail/session-detail').then((m) => m.SessionDetailPage),
  },
  { path: '**', redirectTo: '' },
];
