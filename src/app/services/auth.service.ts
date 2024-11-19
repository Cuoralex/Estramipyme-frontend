import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { catchError, map, Observable, of } from 'rxjs';
import { Admin } from '../models/admin';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/companies';
  private baseUrlAdmin='http://localhost:8080/admins';

  isLoggedIn:boolean=false;

  constructor(private http: HttpClient) { }

  registerUser(userDetails: any) {
    return this.http.post(this.baseUrl, userDetails)
  }

  login(email: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(`${this.baseUrl}?email=${email}`).pipe(  // Se usan comillas invertidas y `${}` para interpolar
      map(usuarios => {
        console.log('Usuarios encontrados:', usuarios);  // Verifica qué usuarios se están recuperando
        if (usuarios.length > 0) {
          const user = usuarios[0];
          console.log('Usuario encontrado:', user);
          // Compara la contraseña ingresada con la almacenada en la base de datos
          if (password === user.password) {  // Asegúrate de comparar la contraseña correctamente
            return user;
          } else {
            return null;
          }
        } else {
          return null;
        }
      }),
      catchError(() => of(null))
    );
  }
  
  loginAdmin(email: string, password: string): Observable<Admin | null> {
    return this.http.get<Admin[]>(`${this.baseUrlAdmin}?email=${email}`).pipe(  // Se usan comillas invertidas y `${}` para interpolar
      map(admins => {
        if (admins.length > 0) {
          const admin = admins[0];
  
          // Asegúrate de que la contraseña coincida y que sea un admin
          if (password === admin.password) {
            return admin;
          } else {
            return null;
          }
        } else {
          return null;
        }
      }),
      catchError(() => of(null))
    );
  }
  
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);  // Se usan comillas invertidas y `${}` para interpolar
  }
  

  getLogin(){
    return this.isLoggedIn
  }
}