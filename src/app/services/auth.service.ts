import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:8080/auth';
  httpClient: any;

  constructor(private http: HttpClient) {}

  /**
   * Autenticación de usuario
   * @param email Correo del usuario
   * @param password Contraseña del usuario
   * @returns Observable con token y datos del usuario, o error
   */
  login(email: string, password: string): Observable<{ token: string; user: User | null } | null> {
    const payload = { email, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(`${this.baseUrl}/login`, payload, { headers, responseType: 'text' }).pipe(
      map((response: string) => {
        // Comprobar si la respuesta contiene "Bearer" (es un token JWT)
        if (response.trim().startsWith('Bearer')) {
          // Si el token empieza con "Bearer", lo almacenamos directamente
          console.log('Token recibido:', response);
          localStorage.setItem('token', response);
          return { token: response, user: null }; // Solo el token, sin usuario
        }

        // Si la respuesta no es un token JWT, intentamos parsearla como JSON
        try {
          const jsonResponse = JSON.parse(response);
          if (jsonResponse?.token) {
            console.log('Autenticación exitosa:', jsonResponse);
            localStorage.setItem('token', jsonResponse.token);
            return { token: jsonResponse.token, user: jsonResponse.user || null };
          } else {
            console.error('Formato de respuesta inválido:', jsonResponse);
            return null;
          }
        } catch (error) {
          console.error('Error al parsear la respuesta:', error);
          throw new Error('Respuesta no válida del servidor.');
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error al autenticar al usuario:', error.message);
        return throwError(() => new Error('Error al autenticar. Verifique sus credenciales.'));
      })
    );
  }

  // Otros métodos (registro, perfil, logout, etc.)
}
