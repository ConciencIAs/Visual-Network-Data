import { Injectable } from '@angular/core'
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js'
import { environment } from '@env/environment';


export interface User {
  id?: string
  username: string
  website: string
  avatar_url: string
}

export interface Person {
  id?: number
  email: string
  full_name: string
  genero: string
  age: number
  created_at?: string
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient
  _session: AuthSession | null = null

  constructor() {
    // environment puede venir tipado como un objeto vacío en algunas configuraciones de TS,
    // casteamos a any para acceder a las claves de Supabase sin errores de compilación.
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
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

  signIn(email: string) {
    return this.supabase.auth.signInWithOtp({ email })
  }

  signOut() {
    return this.supabase.auth.signOut()
  }

  getUsers() {
    return this.supabase.from('users').select('id, email, nombre, genero, edad, created_at')
  }

  getUserByEmail(email: string) {
    return this.supabase.from('users').select('id, email, nombre, genero, ega, created_at').eq('email', email).single()
  }

  createUser(person: Person) {
    return this.supabase.from('users').insert(person)
  }

  upsertUser(person: Person) {
    return this.supabase.from('users').upsert(person, { onConflict: 'email' })
  }


}