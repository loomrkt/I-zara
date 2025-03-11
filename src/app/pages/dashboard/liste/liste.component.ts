import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  signal,
  effect,
  inject,
  computed,
} from '@angular/core';
import { FilesService } from '../../../services/files/files.service';
import { ClipboardModule } from '@angular/cdk/clipboard';
import Toastify from 'toastify-js';
import { BytesConverterPipe } from '../../../pipes/bytesConverter.pipe';
import { ExpirationDatePipe } from '../../../pipes/expirationDate.pipe';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-liste',
  standalone: true,
  imports: [ClipboardModule, BytesConverterPipe, ExpirationDatePipe],
  templateUrl: './liste.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListeComponent {
  toastInstance: any;
  private filesService = inject(FilesService);
  liste = computed(() => this.filesService.liste());
  deleteFile(id: string): void {
    this.toastInstance = Toastify({
      text: `<div class="flex justify-start items-center gap-3">
            <div class=" inline-block size-6 border-current border-t-transparent text-white rounded-full" >
              <span class="icon-[line-md--loading-loop] size-6"></span>
            </div>
            Supression en cours...</div>`,
      className:
        'z-[9999] hs-toastify-on:opacity-100 opacity-0 fixed -top-10 end-10 z-90 transition-all duration-300 w-72 text-sm text-white border border-gray-400 rounded-xl shadow-lg [&>.toast-close]:hidden bg-gray-950  p-4',
      close: true,
      duration: -1,
      escapeMarkup: false,
    }).showToast();
    this.filesService.deleteFile(id).subscribe({
      next: (response) => {
        Toastify({
          text: `<div class="flex justify-start items-center gap-3">
          <div class=" inline-block size-6 border-current border-t-transparent text-white rounded-full" >
            <span class="icon-[line-md--circle-twotone-to-confirm-circle-transition] size-6"></span>
          </div>
          ${response.message}</div>`,
          className:
            'z-[9999] hs-toastify-on:opacity-100 opacity-0 fixed -top-10 end-10 z-90 transition-all duration-300 w-72 text-sm text-white border  rounded-xl shadow-lg [&>.toast-close]:hidden bg-emerald-500  p-4',
          duration: 3000,
          close: true,
          escapeMarkup: false,
        }).showToast();
        this.toastInstance.hideToast();
      },
      error: (error) => {
        this.toastInstance.hideToast();
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
        console.error('Erreur de connexion:', error);
      },
    });
  }

  getDownloadUrl(item: any): string {
    return `${environment.backendUrl}/files/${item.short_id}`;
  }
}
