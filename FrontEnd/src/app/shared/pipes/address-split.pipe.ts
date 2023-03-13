import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addressSplit'
})
export class AddressSplitPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string[] {
    return value.split(',');
  }

}
