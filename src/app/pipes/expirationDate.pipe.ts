import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'ExpirationDate',
})
export class ExpirationDatePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {

    const currentDate = new Date();
    const expiration = new Date(value as string);
    return Math.ceil(
      (expiration.getTime() - currentDate.getTime()) / (1000 * 3600 * 24) 
    );
  }

}
