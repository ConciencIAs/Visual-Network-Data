import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '@services/supabase/supabase.services';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { Toast } from '@app/services/toast/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  signInForm!: FormGroup;
  loading = false;
  emailSent = false;

  constructor(
    private readonly supabase: SupabaseService,
    private router: Router,
    private toastServices: Toast
  ) {
    // Inicializar el formulario en el constructor
    this.signInForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  benefits = [
    {
      title: 'Sin contraseña',
      iconColor: 'text-indigo-600',
      iconPath:
        'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    },
    {
      title: 'Seguro',
      iconColor: 'text-green-600',
      iconPath:
        'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    },
    {
      title: 'Rápido',
      iconColor: 'text-purple-600',
      iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
    },
  ];

  async ngOnInit() {
    const { session } = await this.supabase.getSession();
    if (session) {
      await this.router.navigate(['/form/register']);
      return;
    }

    // Escuchar cambios en el estado de autenticación
    this.supabase.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if (event === 'SIGNED_IN' && session) {
        await this.router.navigate(['/form/register']);
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.signInForm.invalid) {
      return;
    }

    try {
      this.loading = true;
      const email = this.signInForm.value.email as string;

      const isAuthorized = await this.supabase.isAuthorizedUserByEmail(email);

      if (!isAuthorized) {
        // success, info, warn and error
        console.log('Usuario no autorizado:', email);
        this.toastServices.warn(
          'No estás autorizado para acceder. Por favor, contacta al administrador.',
          'Acceso Denegado'
        );
        return;
      }

      const { error } = await this.supabase.signIn(email);
      console.log('Error de inicio de sesión:', error);

      if (error) throw error;

      localStorage.setItem('userEmail', email);
      this.emailSent = true;

      this.toastServices.success(
        'Se ha enviado un enlace de acceso a tu correo electrónico.',
        'Correo Enviado'
      );
    } catch (error) {
      if (error instanceof Error) {
        this.toastServices.error(
          `Error al enviar el correo de acceso: ${error.message}`,
          'Error de Autenticación'
        );
      }
    } finally {
      this.signInForm.reset();
      this.loading = false;
    }
  }

  resetForm() {
    this.emailSent = false;
    this.signInForm.reset();
  }

}
