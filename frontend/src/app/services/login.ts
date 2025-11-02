import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../../Models/User';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl = 'http://localhost:3000/api/users';
  private loginStatusSubject = new BehaviorSubject<boolean>(this.getStoredLoginStatus());
  loginStatus$ = this.loginStatusSubject.asObservable();

  private currentUserId: string = '';
  private currentEmail: string = '';
  private currentName: string = '';

  constructor(private http: HttpClient) {}

  // Register a new user
  registerUser(user: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, user);
  }

  // Login user
  loginUser(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password });
  }

  // Set login status and store session data
  setLoginStatus(status: boolean, userId: string = '', name:string='', email: string = '', token: string = ''): void {
    this.loginStatusSubject.next(status);
    this.currentUserId = userId;
    this.currentEmail = email;
    this.currentName = name;

    localStorage.setItem('isLoggedIn', JSON.stringify(status));
    localStorage.setItem('currentUserId', userId);
    localStorage.setItem('currentName', name);
    localStorage.setItem('currentEmail', email);
    localStorage.setItem('authToken', token);
    localStorage.setItem('token', token); // Also save as 'token' for cart service
  }

  // Get login status as boolean
  private getStoredLoginStatus(): boolean {
    const stored = localStorage.getItem('isLoggedIn');
    return stored ? JSON.parse(stored) : false;
  }

  // Get login status as observable
  getLoginStatus(): Observable<boolean> {
    return this.loginStatus$;
  }

  getCurrentUserId(): string {
    return localStorage.getItem('currentUserId') || '';
  }

  getCurrentEmail(): string {
    return localStorage.getItem('currentEmail') || '';
  }

  getCurrentName(): string {
    return localStorage.getItem('currentName') || '';
  }

  getAuthToken(): string {
    return localStorage.getItem('authToken') || '';
  }

  logout(): void {
    this.setLoginStatus(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('currentEmail');
    localStorage.removeItem('currentName');
  }
}
