import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { map, catchError, Observable, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuth().pipe(
    map((response) => {
      if (response.authenticated === true) {
        return true;
      }
      router.navigate(['']);
      return false;
    }),
    catchError((error) => {
      router.navigate(['']);
      return of(false);
    })
  );
};