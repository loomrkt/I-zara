import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);
  const accessToken = cookieService.get('accessToken');

  // Liste des URLs publiques qui n'ont pas besoin d'un accessToken
  const publicUrls = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/google',
    '/api/auth/google/callback'
  ];

  // Vérifier si l'URL de la requête actuelle est dans la liste des URLs publiques
  if (publicUrls.some(url => req.url.includes(url))) {
    return next(req); // Ne modifie pas la requête si elle est publique
  }

  // Ajouter le token à l'Authorization header pour les requêtes privées
  const modifiedReq = accessToken
    ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
    : req;

  return next(modifiedReq);
};
