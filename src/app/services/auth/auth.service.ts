import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  catchError,
  Observable,
  switchMap,
  takeWhile,
  throwError,
  timer,
} from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.backendUrl; // Assurez-vous d'avoir défini l'URL de votre API

  constructor(private http: HttpClient) {}
  // Enregistrer un nouvel utilisateur
  register(email: string, password: string): Observable<any> {
    return this.http
      .post(
        `${this.apiUrl}/auth/register`,
        { email, password },
        { withCredentials: true }
      )
      .pipe(
        catchError((error) => this.handleErrorRegister(error)) // Utilisation de la fonction handleError
      );
  }

  // Se connecter avec email et mot de passe
  login(email: string, password: string): Observable<any> {
    return this.http
      .post(
        `${this.apiUrl}/auth/login`,
        { email, password },
        { withCredentials: true }
      )
      .pipe(catchError((error) => this.handleError(error)));
  }

  // Se connecter via Google
  loginWithGoogle(): void {
    window.location.href = `${this.apiUrl}/auth/google`;
  }

  // Se déconnecter
  logout(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/logout`, {
      withCredentials: true,
    });
  }

  // Vérifier si l'utilisateur est authentifié
  checkAuth(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/auth/checkAuth`, {
        withCredentials: true,
      })
      .pipe(catchError((error) => this.handleErrorCheckAuth(error)));
  }

  // Fonction de gestion des erreurs
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (error.status === 401) {
      errorMessage = 'Email ou mot de passe incorrect';
    } else if (error.status === 400) {
      errorMessage = 'Données invalides, veuillez vérifier votre saisie';
    } else if (error.status === 500) {
      errorMessage = 'Problème serveur, réessayez plus tard';
    }

    // Retourner l'erreur via throwError
    return throwError(() => new Error(errorMessage));
  }

  private handleErrorRegister(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (error.status === 401) {
      errorMessage = 'Email ou mot de passe incorrect';
    }
    if (error.status === 400) {
      errorMessage = 'Email déjà utilisé';
    } else if (error.status === 500) {
      errorMessage = 'Problème serveur, réessayez plus tard';
    }

    // Retourner l'erreur via throwError
    return throwError(() => new Error(errorMessage));
  }

  private handleErrorCheckAuth(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.status === 401) {
      return this.http.get(`${this.apiUrl}/auth/refresh`, {
        withCredentials: true,
      });
    } else if (error.status === 500) {
      errorMessage = 'Problème serveur, réessayez plus tard';
    }

    // Retourner l'erreur via throwError
    return throwError(() => new Error(errorMessage));
  }
}
