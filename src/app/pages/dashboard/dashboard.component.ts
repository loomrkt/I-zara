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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ListeComponent, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styles: ``,
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
        text: 'Envoyé en cours!',
        className:
          'z-[9999] hs-toastify-on:opacity-100 opacity-0 fixed -top-10 end-10 z-90 transition-all duration-300 w-72 text-sm text-white border rounded-xl shadow-lg [&>.toast-close]:hidden bg-gray-950 p-4',
        close: true,
        duration: -1,
        escapeMarkup: false,
      }).showToast();
      this.filesService.createFile(titre!, file!).subscribe(
        (response) => {
          Toastify({
            text: 'Envoye effecuter avec succes!',
            className:
              'z-[9999] hs-toastify-on:opacity-100 opacity-0 fixed -top-10 end-10 z-90 transition-all duration-300 w-72 text-sm text-white border  rounded-xl shadow-lg [&>.toast-close]:hidden bg-teal-500 bg-teal-400  p-4',
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
          console.error('File upload failed', error);
        }
      );
    }
  }
}
