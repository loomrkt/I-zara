import { Component } from '@angular/core';
import { BytesConverterPipe } from '../../pipes/bytesConverter.pipe';
import { ExpirationDatePipe } from '../../pipes/expirationDate.pipe';
import {
  IMAGE_LOADER,
  ImageLoaderConfig,
  NgOptimizedImage,
} from '@angular/common';

@Component({
  selector: 'app-download',
  imports: [BytesConverterPipe, ExpirationDatePipe, NgOptimizedImage],
  templateUrl: './download.component.html',
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
export class DownloadComponent {
  // recupere les parametres de l'url
  file = this.getParams().file;
  titre = this.getParams().titre;
  taille = this.getParams().taille;
  expiration = this.getParams().expiration;
  getParams(): any {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    return {
      titre: params.get('titre'),
      file: params.get('file_url'),
      taille: params.get('taille'),
      expiration: params.get('expiration_date'),
    };
  }
}
