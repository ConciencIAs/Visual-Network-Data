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
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

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
        this.toastServices.warn('No estás autorizado para acceder. Por favor, contacta al administrador.', 'Acceso Denegado');
        return;
      }

      const { error } = await this.supabase.signIn(email);
      console.log('Error de inicio de sesión:', error);

      if (error) throw error;

      localStorage.setItem('userEmail', email);
      this.emailSent = true;

      this.toastServices.success('Se ha enviado un enlace de acceso a tu correo electrónico.', 'Correo Enviado');

    } catch (error) {
      if (error instanceof Error) {
        this.toastServices.error(`Error al enviar el correo de acceso: ${error.message}`, 'Error de Autenticación');
      }
    } finally {
      this.signInForm.reset();
      this.loading = false;
    }
  }
}
