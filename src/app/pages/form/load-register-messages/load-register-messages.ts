import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '@app/services/supabase/supabase.services';

@Component({
  selector: 'app-load-register-messages',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './load-register-messages.html',
  styleUrl: './load-register-messages.scss'
})
export class LoadRegisterMessages {
  registerForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      full_name: ['', [Validators.required, Validators.minLength(3)]],
      age: ['', [Validators.required, Validators.min(0), Validators.max(150)]],
      gender: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      department: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{9,}$')]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      try {
        const { data, error } = await this.supabaseService.saveRegisterMessages(this.registerForm.value);
        if (error) throw error;

        // Mostrar mensaje de éxito
        alert('¡Registro completado exitosamente!');

        // Redireccionar al gráfico
        await this.router.navigate(['/graph']);

      } catch (error) {
        console.error('Error al guardar:', error);
        this.loading = false;
        // Mostrar mensaje de error al usuario
        if (error instanceof Error) {
          alert('Error al guardar el registro: ' + error.message);
        } else {
          alert('Error al guardar el registro. Por favor, intenta nuevamente.');
        }
      } finally {
        this.loading = false;
      }
    } else {
      // Mostrar mensaje si el formulario es inválido
      alert('Por favor, completa todos los campos requeridos correctamente.');
    }
  }

  onReset() {
    this.registerForm.reset();
  }
}
