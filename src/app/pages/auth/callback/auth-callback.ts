import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '@services/supabase/supabase.services';

@Component({
  selector: 'app-auth-callback',
  template: `<div class="min-h-screen flex items-center justify-center">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>`,
  standalone: true
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.handleAuthCallback();
  }

  private async handleAuthCallback() {
    try {
      const { session, error } = await this.supabase.getSession();

      if (error) throw error;

      if (session) {
        // La sesión está activa, redirigir al formulario de registro
        await this.router.navigate(['/form/register']);
      } else {
        // No hay sesión, redirigir al login
        await this.router.navigate(['/auth/login']);
      }
    } catch (error) {
      console.error('Error en el callback de autenticación:', error);
      await this.router.navigate(['/auth/login']);
    }
  }
}