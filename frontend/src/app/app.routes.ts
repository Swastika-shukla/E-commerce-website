import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { Contact } from './components/contact/contact';
import { Profile } from './components/profile/profile';
import { CartPage } from './components/carts/carts';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Home }, 
  { path: 'home', component: Home },
  { path: 'contact', component: Contact },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'cart', component: CartPage, canActivate: [authGuard] }
];