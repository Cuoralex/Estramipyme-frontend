import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/companies';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(user:User):void{
    this.currentUserSubject.next(user)
  }

  logout():void{
    this.currentUserSubject.next(null)
  }

  getCompanyProfile(companyId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${companyId}/profile`);
  }

}
