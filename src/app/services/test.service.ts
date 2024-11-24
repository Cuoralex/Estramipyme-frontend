import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  private baseUrl = 'http://localhost:8080/tests';
  private companyUrl = 'http://localhost:8080/companies';

  constructor(private http: HttpClient) {}

  registerTest(testDetails: any) {
    console.log('Enviando test:', testDetails);
    return this.http
      .get<any[]>(`${this.baseUrl}?id=${testDetails.id_empresa}`)
      .pipe(
        catchError((error) => {
          console.error('Error en la búsqueda:', error);
          // Si no encuentra el test, crear uno nuevo
          if (error.status === 400) {
            return of([]);
          }
          throw error;
        }),
        switchMap((existingTests) => {
          if (existingTests && existingTests.length > 0) {
            console.log('Test existente, actualizando...');
            return this.http.put(
              `${this.baseUrl}/${testDetails.id_empresa}`,
              testDetails
            );
          } else {
            console.log('Creando nuevo test...');
            return this.http.post(this.baseUrl, testDetails);
          }
        }),
        catchError((error) => {
          console.error('Error en operación:', error);
          throw error;
        })
      );
  }

  updateisTestDone(user: any) {
    console.log('Actualizando estado para usuario:', user);
    return this.http
      .put(`${this.companyUrl}/${user.id}/test-status`, { isTestDone: true })
      .pipe(
        catchError((error) => {
          console.error('Error actualizando estado:', error);
          throw error;
        })
      );
  }
}
