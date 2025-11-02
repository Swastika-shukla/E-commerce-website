import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { LoginService } from '../services/login';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  return loginService.getLoginStatus().pipe(
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true;
      } else {
        // Redirect to home page if not logged in
        router.navigate(['/home']);
        return false;
      }
    })
  );
};
