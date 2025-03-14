import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
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
