import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
features = [
    {
      title: 'Anónimo',
      description: 'Respuestas honestas',
      bgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
      title: 'Rápido',
      description: 'Resultados instantáneos',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      iconPath: 'M13 10V3L4 14h7v7l9-11h-7z'
    },
    {
      title: 'Visual',
      description: 'Gráficos interactivos',
      bgColor: 'bg-pink-100',
      iconColor: 'text-pink-600',
      iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    },
    {
      title: 'Seguro',
      description: 'Datos protegidos',
      bgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      iconPath: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
    }
  ];

  satelliteNodes = [
    { id: 1, color: 'bg-pink-400', size: 48, top: '2rem', left: '2rem', delay: '0s' },
    { id: 2, color: 'bg-indigo-400', size: 40, top: '3rem', right: '3rem', delay: '0.5s' },
    { id: 3, color: 'bg-purple-400', size: 56, bottom: '3rem', left: '4rem', delay: '1s' },
    { id: 4, color: 'bg-blue-400', size: 48, bottom: '4rem', right: '2rem', delay: '1.5s' }
  ];

  stats = [
    { value: '127', label: 'Opiniones', bgColor: 'bg-indigo-50', textColor: 'text-indigo-600' },
    { value: '89%', label: 'Positivas', bgColor: 'bg-purple-50', textColor: 'text-purple-600' },
    { value: '4.5', label: 'Rating', bgColor: 'bg-pink-50', textColor: 'text-pink-600' }
  ];
}
