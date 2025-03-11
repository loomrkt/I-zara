import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  private apiUrl = environment.backendUrl;

  liste = signal<any[]>([]);

  constructor(private http: HttpClient, private authService: AuthService) {
    this.getFiles();
  }

  getFiles(): void {
    this.http
      .get<any[]>(`${this.apiUrl}/files`, { withCredentials: true })
      .subscribe({
        next: (files) => {
          this.liste.set([...files]); // Met à jour le signal
        },
        error: (error) => {
          this.authService.checkAuth().subscribe({
            next: () => {
              this.getFiles();
            },
            error: (error) => {
              console.error(error);
            },
          });
        },
      });
  }

  createFile(titre: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('file', file);

    // Subject pour suivre la progression
    const progressSubject = new BehaviorSubject<number>(0);

    const uploadReq = new HttpRequest(
      'POST',
      `${this.apiUrl}/files`,
      formData,
      {
        headers: new HttpHeaders(),
        reportProgress: true, // Assure-toi que la progression est rapportée
        withCredentials: true,
      }
    );

    return new Observable((observer) => {
      this.http
        .request(uploadReq)
        .pipe(
          map((event) => {
            switch (event.type) {
              case HttpEventType.UploadProgress:
                if (event.total) {
                  const progress = Math.round(
                    (100 * event.loaded) / event.total
                  );
                  progressSubject.next(progress); // Envoie la progression
                }
                break;
              case HttpEventType.Response:
                return event.body; // L'upload est terminé, renvoie la réponse
            }
            return null; // Default return value
          }),
          catchError((error) => {
            // Gestion des erreurs, réessayer si nécessaire
            return this.authService.checkAuth().pipe(
              map(() => {
                return this.createFile(titre, file); // Si l'authentification est OK, relance l'upload
              })
            );
          })
        )
        .subscribe({
          next: (response) => {
            observer.next(response);
            observer.complete();
          },
          error: (error) => {
            observer.error(error);
          },
        });

      return () => {
        progressSubject.complete(); // Nettoyage du subject
      };
    });
  }

  deleteFile(id: string): Observable<any> {
    return new Observable((observer) => {
      this.http
        .delete(`${this.apiUrl}/files/${id}`, { withCredentials: true })
        .subscribe({
          next: (response) => {
            this.getFiles(); // Rafraîchir la liste après suppression
            observer.next(response);
            observer.complete();
          },
          error: (error) => {
            this.authService.checkAuth().subscribe({
              next: () => {
                this.deleteFile(id).subscribe({
                  next: (response) => {
                    observer.next(response);
                    observer.complete();
                  },
                  error: (error) => {
                    observer.error(error);
                  },
                });
              },
              error: (error) => {
                observer.error(error);
              },
            });
          },
        });
    });
  }
}
