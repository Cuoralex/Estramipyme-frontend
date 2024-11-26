import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = 'http://localhost:8080/companies';
  baseUrl: any;

  constructor(private http: HttpClient) {}

  getCompanies(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(this.apiUrl, { headers });
  }

  getCompanyProfile(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}/profile`);
  }
}
