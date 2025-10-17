import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js'
import { environment } from '@env/environment';

export interface Person {
  id?: number
  email: string
  full_name: string
  genero: string
  age: number
  created_at?: string
}

export interface RegisterMessages {
  full_name: string;
  age: number;
  gender: string;
  country: string;
  city: string;
  department: string;
  phone: number;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private platformId = inject(PLATFORM_ID);
  _session: AuthSession | null = null;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  private safeLocalStorage(operation: 'get' | 'set' | 'remove', key: string, value?: string): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      console.warn('LocalStorage no está disponible en el servidor');
      return null;
    }

    try {
      switch (operation) {
        case 'get':
          return localStorage.getItem(key);
        case 'set':
          if (value) {
            localStorage.setItem(key, value);
            return value;
          }
          return null;
        case 'remove':
          localStorage.removeItem(key);
          return null;
        default:
          console.warn('Operación no soportada en localStorage');
          return null;
      }
    } catch (error) {
      console.error('Error al acceder a localStorage:', error);
      return null;
    }
  }

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session
    })
    return this._session
  }

  profile(user: User) {
    return this.supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', user.id)
      .single()
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  async signIn(email: string) {
    this.safeLocalStorage('set', 'userEmail', email);
    return this.supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + '/auth/callback'
      }
    });
  }

  signOut() {
    this.safeLocalStorage('remove', 'userEmail');
    return this.supabase.auth.signOut();
  }

  isAuthenticated(): boolean {
    return !!this.safeLocalStorage('get', 'userEmail');
  }

  // Método para verificar la sesión actual
  async getSession() {
    const { data: { session }, error } = await this.supabase.auth.getSession();
    return { session, error };
  }

  // Método para escuchar cambios en la autenticación
  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        callback(event, session);
      }
    });
  }

  getUsers() {
    return this.supabase.from('users').select('id, email, nombre, genero, edad, created_at')
  }

  getUserByEmailIsValid(email: string) {
    return this.supabase.from('users').select('*').eq('email', email).single()
  }

  createUser(person: Person) {
    return this.supabase.from('users').insert(person)
  }

  upsertUser(person: Person) {
    return this.supabase.from('users').upsert(person, { onConflict: 'email' })
  }

  getListRegisterUsers()  {
    return this.supabase.from('Leonidas').select('*').limit(20)
  }

  saveRegisterMessages(messages: RegisterMessages) {
    return this.supabase.from('Leonidas').insert(messages)
  }
}