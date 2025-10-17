import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '@services/supabase/supabase.services';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

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
    private router: Router
  ) {
    // Inicializar el formulario en el constructor
    this.signInForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  async ngOnInit() {
    // Verificar si ya hay una sesión activa
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
      const { error } = await this.supabase.signIn(email);

      if (error) throw error;

      // Guardar email en localStorage y marcar que se envió el email
      localStorage.setItem('userEmail', email);
      this.emailSent = true;

      alert('Se ha enviado un enlace de acceso a tu correo electrónico. Por favor, revisa tu bandeja de entrada.');

    } catch (error) {
      if (error instanceof Error) {
        alert('Error al enviar el correo: ' + error.message);
      }
    } finally {
      this.signInForm.reset();
      this.loading = false;
    }
  }
}
