import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { catchError, map, Observable, of } from 'rxjs';
import { Admin } from '../models/admin';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/companies'; // URL para usuarios
  private baseUrlAdmin = 'http://localhost:8080/admins'; // URL para administradores

  isLoggedIn: boolean = false; // Indicador de sesión iniciada
  apiUrl: any;

  constructor(private http: HttpClient) {}

  registerUser(userDetails: any): Observable<any> {
    return this.http.post(this.baseUrl, userDetails);
  }

  login(email: string, password: string): Observable<{ token: string; user: User } | null> {
    const payload = { email, password };
    return this.http.post<{ token: string; user: User }>(`${this.baseUrl}/login`, payload).pipe(
      map(response => {
        if (response && response.token) {
          console.log('Usuario autenticado:', response.user);
          return response;
        } else {
          console.log('Credenciales incorrectas');
          return null;
        }
      }),
      catchError(() => {
        console.error('Error al autenticar al usuario');
        return of(null);
      })
    );
  }

  loginAdmin(email: string, password: string): Observable<Admin | null> {
    return this.http.get<Admin[]>(this.baseUrlAdmin).pipe(
      map(admins => {
        const admin = admins.find(a => a.email === email && a.password === password);

        if (admin) {
          console.log('Administrador encontrado:', admin);
          return admin;
        } else {
          console.log('No se encontró ningún administrador con el correo y contraseña especificados');
          return null;
        }
      }),
      catchError(() => {
        console.error('Error al obtener los administradores');
        return of(null);
      })
    );
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  getAdmins() {
    const token = localStorage.getItem('token'); // Asume que el token se almacena localmente
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    });

    return this.http.get('http://localhost:8080/admins', { headers });
}

  getLogin(): boolean {
    return this.isLoggedIn;
  }

  getProfile(): Observable<User> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(`${this.baseUrl}/profile`, { headers });
  }
}
