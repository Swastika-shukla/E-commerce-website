import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../../Models/Cart-item';
import { CartService } from '../../services/cart';
import { LoginService } from '../../services/login';
import { SearchService } from '../../services/search';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService, Product } from '../../services/product';

@Component({
  selector: 'app-cart-page',
  imports: [CommonModule],
  templateUrl: './carts.html',
  styleUrls: ['./carts.css']
})
export class CartPage implements OnInit {
  cartItems: CartItem[] = [];
  cartId: string | null = null;
  products: Product[] = [];

  constructor(
    private cartService: CartService,
    private loginService: LoginService,
    private searchService: SearchService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.loginService.getCurrentUserId();

    this.cartService.getCart(userId).subscribe(cart => {
    if (cart && cart.items) {
      this.cartItems = cart.items;
      this.cartId = cart._id;
    }
  });

    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  getProductImage(productId: any): string {
    const id = typeof productId === 'string' ? productId : productId._id;
    const product = this.products.find(p => p._id === id);
    return product?.image || (typeof productId === 'object' ? productId.image : 'assets/default.jpg');
  }

  getProductDescription(productId: any): string {
    const id = typeof productId === 'string' ? productId : productId._id;
    const product = this.products.find(p => p._id === id);
    return product?.description || (typeof productId === 'object' ? productId.description : '');
  }

  getProductPrice(productId: any): number {
    const id = typeof productId === 'string' ? productId : productId._id;
    const product = this.products.find(p => p._id === id);
    return product?.price || (typeof productId === 'object' ? productId.price : 0);
  }

  getProductTitle(productId: any): string {
    const id = typeof productId === 'string' ? productId : productId._id;
    const product = this.products.find(p => p._id === id);
    return product?.title || (typeof productId === 'object' ? productId.title : 'Unknown Product');
  }


  getTotalCost(): number {
    return this.cartItems.reduce((total, item) => {
      const price = this.getProductPrice(item.productId);
      return total + price * item.quantity;
    }, 0);
  }

 increaseQuantity(item: CartItem): void {
  const userId = this.loginService.getCurrentUserId();
  const productId = typeof item.productId === 'string' ? item.productId : (item.productId as any)._id;
  item.quantity++;
  this.cartService.updateCart(userId, productId, item.quantity).subscribe({
    next: () => console.log('Item quantity increased'),
    error: err => {
      console.error('Error increasing quantity:', err);
      item.quantity--; // Revert on error
    }
  });
}

decreaseQuantity(item: CartItem): void {
  const userId = this.loginService.getCurrentUserId();
  const productId = typeof item.productId === 'string' ? item.productId : (item.productId as any)._id;
  if (item.quantity > 1) {
    item.quantity--;
    this.cartService.updateCart(userId, productId, item.quantity).subscribe({
      next: () => console.log('Item quantity decreased'),
      error: err => {
        console.error('Error decreasing quantity:', err);
        item.quantity--; // Revert on error
      }
    });
  } else {
    this.removeItem(item);
  }
}


  removeItem(item: CartItem): void {
    const userId = this.loginService.getCurrentUserId();
    const productId = typeof item.productId === 'string' ? item.productId : (item.productId as any)._id;
    this.cartService.removeItem(productId, userId).subscribe({
      next: () => {
        const itemProductId = typeof item.productId === 'string' ? item.productId : (item.productId as any)._id;
        this.cartItems = this.cartItems.filter(ci => {
          const ciProductId = typeof ci.productId === 'string' ? ci.productId : (ci.productId as any)._id;
          return ciProductId !== itemProductId;
        });
        console.log('Item removed');
      },
      error: err => console.error('Error removing item:', err)
    });
  }

  clearCart(): void {
    const userId = this.loginService.getCurrentUserId();
    this.cartService.clearCart(userId).subscribe({
      next: () => {
        this.cartItems = [];
        console.log('Cart cleared');
      },
      error: err => console.error('Error clearing cart:', err)
    });
  }

  checkout(): void {
    console.log('Proceeding to payment...');
    alert('Thank you for your purchase!');
    this.clearCart();
  }
}
