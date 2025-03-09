import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { map, catchError, Observable, of } from 'rxjs';

export const authGuard: (requiresAuth: boolean) => CanActivateFn =
  (requiresAuth) => (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.checkAuth().pipe(
      map((response: { authenticated: boolean }) => {
        if (requiresAuth) {
          if (!response.authenticated) {
            router.navigate(['/']);
            return false;
          }
        } else {
          if (response.authenticated) {
            router.navigate(['/dashboard']);
            return false;
          }
        }
        return true;
      }),
      catchError(() => of(!requiresAuth))
    );
  };
