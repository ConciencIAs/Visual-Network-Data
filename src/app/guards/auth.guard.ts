import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private platformId = inject(PLATFORM_ID);

  constructor(private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Verificar si estamos en el navegador
    if (!isPlatformBrowser(this.platformId)) {
      return true; // Permitir en SSR, la verificación real ocurrirá en el cliente
    }

    try {
      const userEmail = localStorage.getItem('userEmail');

      if (userEmail) {
        return true;
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }

    // Si no hay email o hay error, redirigimos al login
    return this.router.createUrlTree(['/auth/login']);
  }
}