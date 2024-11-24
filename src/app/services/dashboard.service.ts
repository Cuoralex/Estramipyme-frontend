import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { map, Observable } from 'rxjs';
import { Test } from '../models/test';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private baseUrl = 'http://localhost:8080/companies'; // Endpoint del backend para obtener las empresas
  private baseUrlTest = 'https://estramipyme-api.vercel.app/tests'; // Endpoint del backend para obtener los tests

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  // Obtener usuarios que ya han completado el test
  getUsersWithTestDone(): Observable<User[]> {
    return this.getUsers().pipe(
      map((users: User[]) => users.filter((user) => user.isTestDone))
    );
  }

  // Obtener un test por ID
  getTestById(id: string): Observable<Test | undefined> {
    return this.http.get<Test[]>(this.baseUrlTest).pipe(
      map((tests) => tests.find((test) => test.id_empresa === id)) // Encuentra el test con el ID dado
    );
  }
}
