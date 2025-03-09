import { Component } from '@angular/core';
import { BytesConverterPipe } from '../../pipes/bytesConverter.pipe';
import { ExpirationDatePipe } from '../../pipes/expirationDate.pipe';

@Component({
  selector: 'app-download',
  imports: [BytesConverterPipe, ExpirationDatePipe],
  templateUrl: './download.component.html',
  styles: ``,
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
