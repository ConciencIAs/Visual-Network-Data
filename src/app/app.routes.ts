import { Routes } from '@angular/router';

export const routes: Routes = [
  {path: '', loadComponent: () => import('./pages/graph/graph').then(m => m.Graph)},
  {path: 'login', loadComponent: () => import('./pages/auth/login/login').then(m => m.Login)},
];
