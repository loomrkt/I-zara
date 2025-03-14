import { Component, inject } from '@angular/core';
import { ListeComponent } from './liste/liste.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FilesService } from '../../services/files/files.service';
import Toastify from 'toastify-js';
import {
  IMAGE_LOADER,
  ImageLoaderConfig,
  NgOptimizedImage,
} from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ListeComponent,
    ReactiveFormsModule,
    NgOptimizedImage,
    MatProgressBarModule,
  ],
  templateUrl: './dashboard.component.html',
  styles: ``,
  providers: [
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => {
        const [path, token] = config.src.split('?token=');
        return `https://firebasestorage.googleapis.com/v0/b/multimediart-f509c.appspot.com/o/assets%2F${encodeURIComponent(
          path
        )}?alt=media&token=${token}`;
      },
    },
  ],
})
export class DashboardComponent {
  private filesService = inject(FilesService);
  toastifyInstance: any;
  filename = '';
  progress: number = 0;
  progressCompression: number = 0;
  filesForm = new FormGroup({
    titre: new FormControl('', [Validators.required]),
    file: new FormControl(null, [Validators.required]),
  });
  isUploading: boolean = false;

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.filename = file.name;
    this.filesForm.patchValue({ file });
    this.filesForm.get('file')?.updateValueAndValidity();
  }

  createToast() {
    this.toastifyInstance = Toastify({
      text: this.generateToastContent(),
      className:
        'z-[9999] hs-toastify-on:opacity-100 opacity-0 fixed -top-10 end-10 z-90 transition-all duration-300 w-72 text-sm text-white border rounded-xl shadow-lg [&>.toast-close]:hidden bg-gray-950  p-4',
      close: true,
      duration: -1,
      escapeMarkup: false,
    }).showToast();

    // Suivi de la progression de compression et d'upload
    this.filesService.getCompressProgress().subscribe({
      next: (value) => {
        this.progressCompression = value;
        this.updateToast();
      },
    });

    this.filesService.getUploadProgress().subscribe({
      next: (value) => {
        this.progress = value;
        this.updateToast();
      },
    });
  }

  updateToast() {
    if (this.toastifyInstance?.toastElement) {
      this.toastifyInstance.toastElement.innerHTML =
        this.generateToastContent();
    }
  }

  private generateToastContent(): string {
    return `<div class="relative" role="alert">
    <div class="flex gap-x-3">
      <div class="shrink-0">
        <span class="m-1 inline-flex justify-center items-center size-8 rounded-full bg-gray-100/20 text-white">
          <span class="icon-[line-md--uploading-loop] size-6"></span>
        </span>
      </div>
      <div class="grow me-5">
        <h3 class="text-white font-medium text-sm">
          Upload en cours
        </h3>
        <div class="mt-2">
          <p class="text-xs text-gray-300">Compression: ${this.progressCompression}%</p>
          <div class="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700" role="progressbar" aria-valuenow="${this.progressCompression}" aria-valuemin="0" aria-valuemax="100">
            <div class="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition duration-500 dark:bg-blue-500" style="width: ${this.progressCompression}%"></div>
          </div>
          <p class="text-xs text-gray-300 mt-2">Upload: ${this.progress}%</p>
          <div class="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700" role="progressbar" aria-valuenow="${this.progress}" aria-valuemin="0" aria-valuemax="100">
            <div class="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition duration-500 dark:bg-blue-500" style="width: ${this.progress}%"></div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
  }
  onSubmit(): void {
    if (this.filesForm.valid && !this.isUploading) {
      this.isUploading = true; // Empêcher les doubles uploads

      const titre = this.filesForm.get('titre')?.value;
      const file = this.filesForm.get('file')?.value;

      this.createToast();

      this.filesService.createFile(titre!, file!).subscribe(
        (response) => {
          Toastify({
            text: `<div class="flex justify-start items-center gap-3">
              <div class="inline-block size-6 border-current border-t-transparent text-white rounded-full">
                <span class="icon-[line-md--circle-twotone-to-confirm-circle-transition] size-6"></span>
              </div>
              Upload bien effectué</div>`,
            className:
              'z-[9999] hs-toastify-on:opacity-100 opacity-0 fixed -top-10 end-10 z-90 transition-all duration-300 w-72 text-sm text-white border rounded-xl shadow-lg [&>.toast-close]:hidden bg-emerald-500 p-4',
            duration: 3000,
            close: true,
            escapeMarkup: false,
          }).showToast();

          // Réinitialisation du formulaire et des variables
          this.filesForm.reset();
          this.filename = '';
          this.toastifyInstance.hideToast();
          this.progress = 0;
          this.progressCompression = 0;
          this.isUploading = false; // Autoriser un nouvel upload
        },
        (error) => {
          this.toastifyInstance.hideToast();
          Toastify({
            text: `<div class="flex justify-start items-center gap-3">
              <div class="inline-block size-6 border-current border-t-transparent text-white rounded-full">
                <span class="icon-[line-md--alert-loop] size-6"></span>
              </div>
              ${error.message}</div>`,
            className:
              'z-[9999] hs-toastify-on:opacity-100 opacity-0 fixed -top-10 end-10 z-90 transition-all duration-300 w-72 text-sm text-white border rounded-xl shadow-lg [&>.toast-close]:hidden bg-red-800 border-red-700 p-4',
            duration: 3000,
            close: true,
            escapeMarkup: false,
          }).showToast();
          console.error('File upload failed', error);

          // Réinitialiser isUploading pour permettre un nouvel upload
          this.isUploading = false;
        }
      );
    } else if (!this.filesForm.valid) {
      this.progress = 0;
      this.progressCompression = 0;
      this.isUploading = false;
      Toastify({
        text: `<div class="flex justify-start items-center gap-3">
          <div class="inline-block size-6 border-current border-t-transparent text-white rounded-full">
            <span class="icon-[line-md--alert-loop] size-6"></span>
          </div>
          Veuillez remplir tous les champs</div>`,
        className:
          'z-[9999] hs-toastify-on:opacity-100 opacity-0 fixed -top-10 end-10 z-90 transition-all duration-300 w-72 text-sm text-white border rounded-xl shadow-lg [&>.toast-close]:hidden bg-red-800 border-red-700 p-4',
        duration: 3000,
        close: true,
        escapeMarkup: false,
      }).showToast();
    }
  }
}
