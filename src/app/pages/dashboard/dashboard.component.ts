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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ListeComponent, ReactiveFormsModule, NgOptimizedImage],
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
  filesForm = new FormGroup({
    titre: new FormControl('', [Validators.required]),
    file: new FormControl(null, [Validators.required]),
  });

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.filename = file.name;
    this.filesForm.patchValue({ file });
    this.filesForm.get('file')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.filesForm.valid) {
      const titre = this.filesForm.get('titre')?.value;
      const file = this.filesForm.get('file')?.value;
      this.toastifyInstance = Toastify({
        text: `<div class="flex justify-start items-center gap-3">
            <div class=" inline-block size-6 border-current border-t-transparent text-white rounded-full" >
              <span class="icon-[line-md--uploading-loop] size-6"></span>
            </div>
            Envoye en cours...</div>`,
        className:
          'z-[9999] hs-toastify-on:opacity-100 opacity-0 fixed -top-10 end-10 z-90 transition-all duration-300 w-72 text-sm text-white border rounded-xl shadow-lg [&>.toast-close]:hidden bg-gray-950 p-4',
        close: true,
        duration: -1,
        escapeMarkup: false,
      }).showToast();
      this.filesService.createFile(titre!, file!).subscribe(
        (response) => {
          Toastify({
            text: `<div class="flex justify-start items-center gap-3">
          <div class=" inline-block size-6 border-current border-t-transparent text-white rounded-full" >
            <span class="icon-[line-md--circle-twotone-to-confirm-circle-transition] size-6"></span>
          </div> 
          Envoye effecuter avec succes!
          </div>`,
            className:
              'z-[9999] hs-toastify-on:opacity-100 opacity-0 fixed -top-10 end-10 z-90 transition-all duration-300 w-72 text-sm text-white border  rounded-xl shadow-lg [&>.toast-close]:hidden bg-emerald-500  p-4',
            duration: 3000,
            close: true,
            escapeMarkup: false,
          }).showToast();
          // Reset the form
          this.filesForm.reset();
          this.filename = '';
          this.toastifyInstance.hideToast();
        },
        (error) => {
          this.toastifyInstance.hideToast();
          Toastify({
            text: `<div class="flex justify-start items-center gap-3">
            <div class=" inline-block size-6 border-current border-t-transparent text-white rounded-full" >
              <span class="icon-[line-md--alert-loop] size-6"></span>
            </div>
            ${error.message}</div>`,
            className:
              'z-[9999] hs-toastify-on:opacity-100 opacity-0 fixed -top-10 end-10 z-90 transition-all duration-300 w-72 text-sm text-white border  rounded-xl shadow-lg [&>.toast-close]:hidden bg-red-800 border-red-700  p-4',
            duration: 3000,
            close: true,
            escapeMarkup: false,
          }).showToast();
          console.error('File upload failed', error);
        }
      );
    }
  }
}
