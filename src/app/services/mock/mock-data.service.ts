import { Injectable } from '@angular/core';

export interface MockRegisterData {
  age: number;
  city: string;
  country: string;
  created_at: string;
  department: string;
  full_name: string;
  gender: string;
  id: string;
  message: string;
  phone: number;
  user_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private cities: Record<string, Record<string, string[]>> = {
    'Colombia': {
      'Caldas': ['Manizales', 'Pensilvania', 'La Dorada', 'Chinchiná'],
      'Antioquia': ['Medellín', 'Envigado', 'Bello', 'Rionegro'],
      'Cundinamarca': ['Bogotá', 'Zipaquirá', 'Chía', 'Soacha']
    },
    'España': {
      'Madrid': ['Madrid', 'Alcalá', 'Móstoles', 'Getafe'],
      'Cataluña': ['Barcelona', 'Girona', 'Tarragona', 'Lleida'],
      'Andalucía': ['Sevilla', 'Granada', 'Málaga', 'Córdoba']
    },
    'México': {
      'Jalisco': ['Guadalajara', 'Zapopan', 'Tlaquepaque', 'Tonalá'],
      'CDMX': ['Ciudad de México', 'Coyoacán', 'Tlalpan', 'Iztapalapa'],
      'Nuevo León': ['Monterrey', 'San Pedro', 'San Nicolás', 'Guadalupe']
    }
  };

  private firstNames = [
    'Ana', 'Juan', 'María', 'Carlos', 'Laura', 'Miguel', 'Sofia', 'Diego',
    'Valentina', 'Daniel', 'Isabella', 'Andrés', 'Lucía', 'Fernando', 'Camila'
  ];

  private lastNames = [
    'García', 'Rodríguez', 'Martínez', 'López', 'González', 'Pérez', 'Sánchez',
    'Ramírez', 'Torres', 'Flores', 'Rivera', 'Gómez', 'Díaz', 'Cruz', 'Morales'
  ];

  private messages = [
    'Me interesa participar en el proyecto',
    'Quisiera más información sobre la iniciativa',
    'Me gustaría colaborar en el desarrollo',
    'Tengo experiencia en visualización de datos',
    'Estoy interesado en el análisis de redes',
    'Me apasiona la ciencia de datos',
    'Busco oportunidades de aprendizaje',
    'Quiero aportar al proyecto',
    'Tengo ideas para implementar',
    'Me gustaría formar parte del equipo'
  ];

  generateMockData(count: number = 50): MockRegisterData[] {
    const mockData: MockRegisterData[] = [];
    const countries = Object.keys(this.cities);
    const now = new Date();

    for (let i = 0; i < count; i++) {
      const country = countries[Math.floor(Math.random() * countries.length)];
      const departments = Object.keys(this.cities[country]);
      const department = departments[Math.floor(Math.random() * departments.length)];
      const cityList = this.cities[country][department];
      const city = cityList[Math.floor(Math.random() * cityList.length)];

      const firstName = this.firstNames[Math.floor(Math.random() * this.firstNames.length)];
      const lastName = this.lastNames[Math.floor(Math.random() * this.lastNames.length)];
      const message = this.messages[Math.floor(Math.random() * this.messages.length)];

      // Generar fecha aleatoria en los últimos 30 días
      const date = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);

      mockData.push({
        id: `user-${i + 1}`,
        user_id: `uid-${i + 1}`,
        full_name: `${firstName} ${lastName}`,
        age: Math.floor(Math.random() * 40) + 20, // Edad entre 20 y 60
        gender: Math.random() > 0.5 ? 'M' : 'F',
        country,
        department,
        city,
        phone: Math.floor(Math.random() * 9000000000) + 1000000000,
        message,
        created_at: date.toISOString()
      });
    }

    // Asegurar que haya una buena distribución de datos
    mockData.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    return mockData;
  }
}