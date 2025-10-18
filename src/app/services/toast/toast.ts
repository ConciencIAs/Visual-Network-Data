import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class Toast {
  // success, info, warn and error.
  constructor(private messageService: MessageService) {}

  success(detail: string, summary: string = 'Éxito', life: number = 3000) {
    this.messageService.add({
      severity: 'success',
      summary,
      detail,
      life,
    });
  }

  error(detail: string, summary: string = 'Error', life: number = 5000) {
    this.messageService.add({
      severity: 'error',
      summary,
      detail,
      life,
    });
  }

  info(detail: string, summary: string = 'Información', life: number = 3000) {
    this.messageService.add({
      severity: 'info',
      summary,
      detail,
      life,
    });
  }

  warn(detail: string, summary: string = 'Advertencia', life: number = 4000) {
    this.messageService.add({
      severity: 'warn',
      summary,
      detail,
      life,
    });
  }

  custom(severity: string, summary: string, detail: string, life: number = 3000) {
    this.messageService.add({
      severity,
      summary,
      detail,
      life,
    });
  }

  clear() {
    this.messageService.clear();
  }
}
