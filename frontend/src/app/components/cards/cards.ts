import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../services/search';
import { SearchFilterPipe } from '../../pipes/search-filter-pipe';
import { CartItem } from '../../../Models/Cart-item';
import { CartService } from '../../services/cart';
import { LoginService } from '../../services/login';
import { ProductService, Product } from '../../services/product';
import { Router, RouterLink } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-cards',
  imports: [CommonModule, SearchFilterPipe, RouterLink],
  templateUrl: './cards.html',
  styleUrls: ['./cards.css']
})
export class Cards implements OnInit {
  searchTerm = '';
  selectedCategory = '';
  products: Product[] = [];
  cart: { [productId: string]: number } = {};
  cartId: string | null = null;
  isLoggedIn: boolean = false;

  constructor(
    private searchService: SearchService,
    private cartService: CartService,
    private loginService: LoginService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to search term changes
    this.searchService.currentSearchTerm.subscribe(term => {
      this.searchTerm = term;
    });

    this.loginService.getLoginStatus().subscribe(status => {
      this.isLoggedIn = status;
      
      // Only load cart if user is logged in
      if (this.isLoggedIn) {
        const userId = this.loginService.getCurrentUserId();
        if (userId) {
          this.cartService.getCart(userId).subscribe({
            next: (data) => {
              if (data && data.items) {
                this.cartId = data._id;
                data.items.forEach((item: any) => {
                  this.cart[item.productId._id || item.productId] = item.quantity;
                });
              }
            },
            error: (err) => {
              // Cart not found is normal for new users - ignore 404 errors
              if (err.status !== 404) {
                console.error('Error loading cart:', err);
              }
            }
          });
        }
      }
    });

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
  }

  scrollLeft(carousel: HTMLElement) {
    carousel.scrollBy({ left: -900, behavior: 'smooth' });
  }

  scrollRight(carousel: HTMLElement) {
    carousel.scrollBy({ left: 900, behavior: 'smooth' });
  }

  addToCart(product: Product) {
    const userId = this.loginService.getCurrentUserId();
    this.cart[product._id] = 1;
    this.cartService.addToCart(userId, product._id, 1).subscribe({
      next: () => console.log('Item added to cart'),
      error: err => console.error('Error adding to cart:', err)
    });
  }

  increaseQuantity(product: Product) {
    const userId = this.loginService.getCurrentUserId();
    this.cart[product._id]++;
    this.cartService.addToCart(userId, product._id, this.cart[product._id]).subscribe({
      next: () => console.log('Quantity increased'),
      error: err => console.error('Error increasing quantity:', err)
    });
  }

  decreaseQuantity(product: Product) {
    const userId = this.loginService.getCurrentUserId();
    if (this.cart[product._id] > 1) {
      this.cart[product._id]--;
      this.cartService.updateCart(userId, product._id, this.cart[product._id]).subscribe({
        next: () => console.log('Quantity decreased'),
        error: err => console.error('Error decreasing quantity:', err)
      });
    } else {
      this.removeFromCart(product);
    }
  }

  removeFromCart(product: Product) {
    const userId = this.loginService.getCurrentUserId();
    this.cartService.removeItem(product._id, userId).subscribe({
      next: () => {
        delete this.cart[product._id];
        console.log('Item removed from cart');
      },
      error: err => console.error('Error removing item:', err)
    });
  }

  isInCart(product: Product): boolean {
    return this.cart.hasOwnProperty(product._id);
  }

  getQuantity(product: Product): number {
    return this.cart[product._id] || 0;
  }

  loginmodal(): void {
    const modal = document.getElementById('loginModal');
    if (modal) {
      const bsModal = new bootstrap.Modal(modal);
      bsModal.show();
    }
  }
}
