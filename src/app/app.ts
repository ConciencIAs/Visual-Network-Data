import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { PrimeNG } from 'primeng/config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule],
  standalone: true,
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App implements OnInit {

  constructor(private primengConfig: PrimeNG) {}

  ngOnInit() {
    // 1. Habilitar el efecto Ripple (feedback visual) globalmente
    this.primengConfig.ripple.set(true);

    // 2. Configurar la traducción global para todos los componentes
    this.primengConfig.setTranslation({
      accept: 'Aceptar',
      reject: 'Rechazar',
      dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      // ... otras claves de traducción
    });

  }
}
