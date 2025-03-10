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
      text: 'suppression en cours!',
      className:
        'z-[9999] hs-toastify-on:opacity-100 opacity-0 fixed -top-10 end-10 z-90 transition-all duration-300 w-72 text-sm text-white border border-gray-400 rounded-xl shadow-lg [&>.toast-close]:hidden bg-gray-950  p-4',
      close: true,
      duration: -1,
      escapeMarkup: false,
    }).showToast();
    this.filesService.deleteFile(id).subscribe((response) => {
      Toastify({
        text: response.message,
        className:
          'z-[9999] hs-toastify-on:opacity-100 opacity-0 fixed -top-10 end-10 z-90 transition-all duration-300 w-72 text-sm text-white border  rounded-xl shadow-lg [&>.toast-close]:hidden bg-teal-500 bg-teal-400  p-4',
        duration: 3000,
        close: true,
        escapeMarkup: false,
      }).showToast();
      this.toastInstance.hideToast();
    });
  }

  getDownloadUrl(item: any): string {
    return `${environment.backendUrl}/files/${item.short_id}`;
  }
}
