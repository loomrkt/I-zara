import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';
import { io } from 'socket.io-client';

type CompressionEvent =
  | { type: 'start'; data: { filename: string; originalSize: number } }
  | { type: 'progress'; progress: number; processed: number; total: number }
  | { type: 'complete'; data: { originalSize: number; compressedSize: number } }
  | { type: 'error'; message: string; code?: string };

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  private apiUrl = environment.backendUrl;
  private socket = io(this.apiUrl);

  liste = signal<any[]>([]);

  constructor(private http: HttpClient, private authService: AuthService) {
    this.getFiles();
  }

  getCompressProgress(): Observable<number> {
    return new Observable((observer) => {
      const onProgress = (data: { progress: number }) => {
        observer.next(data.progress);
      };

      const onComplete = () => {
        observer.complete();
      };

      this.socket.on('compressProgress', onProgress);
      this.socket.on('compressCompleted', onComplete);

      // Nettoyage à la désinscription
      return () => {
        this.socket.off('compressProgress', onProgress);
        this.socket.off('compressCompleted', onComplete);
      };
    });
  }

  getUploadProgress(): Observable<number> {
    return new Observable((observer) => {
      const onProgress = (data: { progress: number }) => {
        observer.next(data.progress);
      };

      const onComplete = () => {
        observer.complete();
      };

      this.socket.on('uploadProgress', onProgress);
      this.socket.on('uploadCompleted', onComplete);

      // Nettoyage à la désinscription
      return () => {
        this.socket.off('uploadProgress', onProgress);
        this.socket.off('uploadCompleted', onComplete);
      };
    });
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
    if (this.socket.id) {
      formData.append('socketId', this.socket.id);
    } else {
      console.error('Socket ID is undefined');
    }

    return new Observable((observer) => {
      this.http
        .post(`${this.apiUrl}/files`, formData, { withCredentials: true })
        .subscribe({
          next: (response) => {
            this.getFiles(); // Rafraîchir la liste après upload
            observer.next(response);
            observer.complete();
          },
          error: (error) => {
            this.authService.checkAuth().subscribe({
              next: () => {
                this.createFile(titre, file).subscribe({
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
