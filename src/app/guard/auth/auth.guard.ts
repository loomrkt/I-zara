import { CanActivateFn, Router } from '@angular/router';
import { inject } from "@angular/core";
import {AuthService} from '../../services/auth/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth : AuthService = inject(AuthService);
  const router : Router = inject(Router);

  if(!auth.isAuth()) {
    router.navigateByUrl('/login').then();
    return false
  }
  return true
};
