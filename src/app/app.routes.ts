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
  { path: '**', redirectTo: '' },
];
