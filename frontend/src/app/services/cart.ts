import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cart } from '../../Models/Cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:3000/api/carts';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  addToCart(userId: string, productId: string, quantity: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, 
      { userId, productId, quantity },
      { headers: this.getHeaders() }
    ).pipe(
      map((response: any) => response.data || response)
    );
  }

  // Get cart by userId
  getCart(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${userId}`, {
      headers: this.getHeaders()
    }).pipe(
      map((response: any) => response.data || response)
    );
  }

  // Remove specific item from cart
  removeItem(productId: string, userId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/remove/${productId}`, {
      headers: this.getHeaders(),
      body: { userId }
    }).pipe(
      map((response: any) => response.data || response)
    );
  }

  // Clear entire cart for a user
  clearCart(userId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/clear/${userId}`, {
      headers: this.getHeaders()
    }).pipe(
      map((response: any) => response.data || response)
    );
  }

  updateCart(userId: string, productId: string, quantity: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/update`, {
      userId,
      productId,
      quantity
    }, {
      headers: this.getHeaders()
    }).pipe(
      map((response: any) => response.data || response)
    );
  }
}
