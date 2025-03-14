import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, Observable, Subject, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';

type CompressionEvent =
  | { type: 'start'; data: { filename: string; originalSize: number } }
  | { type: 'progress'; progress: number; processed: number; total: number }
  | { type: 'complete'; data: { originalSize: number; compressedSize: number } }
  | { type: 'error'; message: string; code?: string };

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  private sseClientId = crypto.randomUUID(); // Génère un ID unique
  private eventSource!: EventSource;
  private progressSubject = new Subject<any>();
  private apiUrl = environment.backendUrl;

  liste = signal<any[]>([]);

  constructor(private http: HttpClient, private authService: AuthService) {
    this.getFiles();
    this.initSSE();
  }

  private initSSE() {
    const connect = () => {
      this.eventSource = new EventSource(
        `${this.apiUrl}/sse/${this.sseClientId}`,
        { withCredentials: true }
      );

      this.eventSource.addEventListener('compressProgress', (e) => {
        this.progressSubject.next({
          type: 'compress',
          data: JSON.parse(e.data),
        });
      });

      this.eventSource.addEventListener('uploadProgress', (e) => {
        console.log('uploadProgress', e.data);
        this.progressSubject.next({ type: 'upload', data: JSON.parse(e.data) });
      });

      this.eventSource.addEventListener('deleteProgress', (e) => {
        this.progressSubject.next({ type: 'delete', data: JSON.parse(e.data) });
      });

      this.eventSource.onerror = (e) => {
        console.error('SSE Error:', e);
        console.log('Ready state:', this.eventSource.readyState);

        // Reconnect only if the connection was closed unexpectedly
        if (this.eventSource.readyState === EventSource.CLOSED) {
          console.log('Reconnecting in 3 seconds...');
          setTimeout(() => connect(), 3000);
        }
      };
    };

    connect();
  }

  getProgress(): Observable<any> {
    return this.progressSubject.asObservable();
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
    formData.append('clientId', this.sseClientId);

    return this.http
      .post(`${this.apiUrl}/files`, formData, { withCredentials: true })
      .pipe(
        catchError((error) => {
          // Si erreur d'authentification, vérifier et renvoyer la requête
          if (error.status === 401) {
            return this.authService.checkAuth().pipe(
              switchMap(() => this.createFile(titre, file)),
              catchError((err) => throwError(() => err))
            );
          }
          // Propager l'erreur originale pour le composant
          return throwError(() => error);
        })
      );
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
