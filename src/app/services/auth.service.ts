import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { catchError, map, Observable, of } from 'rxjs';
import { Admin } from '../models/admin';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/companies'; // URL para usuarios
  private baseUrlAdmin = 'http://localhost:8080/admins'; // URL para administradores

  isLoggedIn: boolean = false; // Indicador de sesión iniciada

  constructor(private http: HttpClient) {}

  /**
   * Registra un nuevo usuario.
   * @param userDetails Detalles del usuario.
   */
  registerUser(userDetails: any): Observable<any> {
    return this.http.post(this.baseUrl, userDetails);
  }

  /**
   * Realiza el inicio de sesión de un usuario.
   * @param email Correo electrónico del usuario.
   * @param password Contraseña del usuario.
   * @returns Un observable con el usuario si es válido, o `null` si no lo es.
   */
  login(email: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(this.baseUrl).pipe(
      map((users) => {
        // Busca un usuario con correo y contraseña coincidentes
        const user = users.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          console.log('Usuario encontrado:', user);
          return user;
        } else {
          console.log(
            'No se encontró ningún usuario con el correo y contraseña especificados'
          );
          return null;
        }
      }),
      catchError(() => {
        console.error('Error al obtener los usuarios');
        return of(null); // Manejo de errores
      })
    );
  }

  /**
   * Realiza el inicio de sesión de un administrador.
   * @param email Correo electrónico del administrador.
   * @param password Contraseña del administrador.
   * @returns Un observable con el administrador si es válido, o `null` si no lo es.
   */
  loginAdmin(email: string, password: string): Observable<Admin | null> {
    return this.http.get<Admin[]>(this.baseUrlAdmin).pipe(
      map((admins) => {
        // Busca un administrador con correo y contraseña coincidentes
        const admin = admins.find(
          (a) => a.email === email && a.password === password
        );

        if (admin) {
          console.log('Administrador encontrado:', admin);
          return admin;
        } else {
          console.log(
            'No se encontró ningún administrador con el correo y contraseña especificados'
          );
          return null;
        }
      }),
      catchError(() => {
        console.error('Error al obtener los administradores');
        return of(null); // Manejo de errores
      })
    );
  }

  /**
   * Obtiene un usuario por su ID.
   * @param id ID del usuario.
   * @returns Un observable con el usuario.
   */
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  /**
   * Retorna el estado de la sesión del usuario.
   * @returns `true` si la sesión está iniciada, `false` en caso contrario.
   */
  getLogin(): boolean {
    return this.isLoggedIn;
  }
}
