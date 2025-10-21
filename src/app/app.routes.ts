import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.Home),
  },
  {
    path: 'graph',
    loadComponent: () => import('./pages/graph/graph').then(m => m.Graph),
    // canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/auth/login/login').then(m => m.Login)
      },
      {
        path: 'callback',
        loadComponent: () => import('./pages/auth/callback/auth-callback').then(m => m.AuthCallbackComponent)
      }
    ]
  },
  {
    path: 'form',
    children: [
      {
        path: 'register',
        loadComponent: () => import('./pages/form/load-register-messages/load-register-messages').then(m => m.LoadRegisterMessages),
        // canActivate: [AuthGuard]
      }
    ]
  },
  // Ruta por defecto si no coincide ninguna
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];
