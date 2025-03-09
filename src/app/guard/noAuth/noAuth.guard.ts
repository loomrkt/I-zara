import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { catchError, map, of } from 'rxjs';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
    const router = inject(Router);
  
    return authService.checkAuth().pipe(
      map((response) => {
        if (response.authenticated === true) {
          router.navigate(['dashboard']);
          return false;
        }
        return true;
      }),
      catchError((error) => {
        return of(true);
      })
    )
};
