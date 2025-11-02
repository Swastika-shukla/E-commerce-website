import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Product {
  _id: string;
  title: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  category: string;
}

interface ApiResponse {
  success: boolean;
  data: Product[];
  pagination?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<ApiResponse>(this.baseUrl).pipe(
      map(response => response.data || [])
    );
  }
}
