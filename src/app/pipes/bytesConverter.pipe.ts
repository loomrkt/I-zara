import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'bytesConverter',
})
export class BytesConverterPipe implements PipeTransform {

  transform(value: number): string {
    if (isNaN(value) || value < 0) {
      return '0 B';
    }

    const kb = value / 1024; // Convertir en kilobytes
    const mb = kb / 1024; // Convertir en megabytes
    const gb = mb / 1024; // Convertir en gigabytes

    if (gb >= 1) {
      return gb.toFixed(2) + ' GB'; // Retourner en gigabytes
    } else if (mb >= 1) {
      return mb.toFixed(2) + ' MB'; // Retourner en megabytes
    } else {
      return kb.toFixed(2) + ' KB'; // Retourner en kilobytes
    }
  }

}
